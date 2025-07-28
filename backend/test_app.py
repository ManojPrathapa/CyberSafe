import unittest 
from app import app
from unittest.mock import patch

class TestCYBERSAFEAPI(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

        self.test_username = "test_user_login"
        self.test_password = "pass123"
        self.client.post("/api/register", json={
            "username": self.test_username,
            "email": "test_user_login@example.com",
            "password": self.test_password,
            "role": "student"
        })



    @patch("resources.activity.get_student_activity")
    def test_student_activity_valid(self, mock_activity):
        mock_activity.return_value = {
            "student_id": 1,
            "activities": [
                {"module": "Cyber Hygiene", "last_accessed": "2025-07-25"},
                {"module": "Cyber Ethics", "last_accessed": "2025-07-26"}
            ]
        }
        res = self.client.get("/api/activity/1")
        self.assertEqual(res.status_code, 200)
        self.assertIn("activities", res.get_json())
        self.assertEqual(len(res.get_json()["activities"]), 2)

    @patch("resources.activity.get_student_activity")
    def test_student_activity_empty(self, mock_activity):
        mock_activity.return_value = {"student_id": 1, "activities": []}
        res = self.client.get("/api/activity/1")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["activities"], [])

    @patch("resources.activity.get_student_activity")
    def test_student_activity_error(self, mock_activity):
        mock_activity.side_effect = Exception("Student not found")
        res = self.client.get("/api/activity/999")
        self.assertEqual(res.status_code, 500)
        self.assertIn("error", res.get_json())


    def test_index(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)

    def test_register(self):
        res = self.client.post("/api/register", json={
            "username": "new_user",
            "email": "new_user@example.com",
            "password": "pass123",
            "role": "student"
        })
        self.assertIn(res.status_code, [200, 201, 400])

    @patch("resources.auth.get_user_by_username")
    def test_register_existing_user(self, mock_get_user):
        mock_get_user.return_value = {"username": "existing_user"}
        res = self.client.post("/api/register", json={
            "username": "existing_user",
            "email": "existing@example.com",
            "password": "pass123",
            "role": "student"
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("error", res.get_json())

    @patch("resources.auth.create_user")
    @patch("resources.auth.get_user_by_username")
    def test_register_new_user(self, mock_get_user, mock_create_user):
        mock_get_user.return_value = None  # User does not exist
        mock_create_user.return_value = None  # Assume creation is successful

        res = self.client.post("/api/register", json={
            "username": "new_user",
            "email": "new_user@example.com",
            "password": "pass123",
            "role": "student"
        })
        self.assertEqual(res.status_code, 201)
        self.assertIn("message", res.get_json())

    @patch("resources.auth.get_user_by_username")
    def test_login_successful(self, mock_get_user):
        mock_get_user.return_value = {
            "id": 1,
            "username": "valid_user",
            "password": "correct_password",
            "role": "student"
        }

        res = self.client.post("/api/login", json={
            "username": "valid_user",
            "password": "correct_password"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("user", data)
        self.assertEqual(data["user"]["username"], "valid_user")

    @patch("resources.auth.get_user_by_username")
    def test_login_wrong_password(self, mock_get_user):
        mock_get_user.return_value = {
            "id": 1,
            "username": "valid_user",
            "password": "correct_password",
            "role": "student"
        }

        res = self.client.post("/api/login", json={
            "username": "valid_user",
            "password": "wrong_password"
        })
        self.assertEqual(res.status_code, 401)
        self.assertIn("error", res.get_json())

    @patch("resources.auth.get_user_by_username")
    def test_login_user_not_found(self, mock_get_user):
        mock_get_user.return_value = None

        res = self.client.post("/api/login", json={
            "username": "nonexistent_user",
            "password": "any_password"
        })
        self.assertEqual(res.status_code, 401)
        self.assertIn("error", res.get_json())


    def test_login(self):
        res = self.client.post("/api/login", json={
            "username": self.test_username,
            "password": self.test_password
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("user", res.get_json())

    def test_get_modules(self):
        res = self.client.get("/api/modules")
        self.assertEqual(res.status_code, 200)

    def test_get_quiz(self):
        res = self.client.get("/api/quiz/1")
        self.assertIn(res.status_code, [200, 404])

    def test_submit_quiz(self):
        res = self.client.post("/api/quiz/submit", json={
            "student_id": 1,
            "quiz_id": 1,
            "answers": {"1": 1}
        })
        self.assertIn(res.status_code, [200, 400])

    def test_ask_doubt(self):
        res = self.client.post("/api/doubt", json={
            "student_id": 1,
            "mentor_id": 3,
            "module_id": 1,
            "question": "What is malware?"
        })
        self.assertIn(res.status_code, [200, 201, 400])

    def test_mentor_doubts(self):
        res = self.client.get("/api/doubts/3")
        self.assertIn(res.status_code, [200, 404])

    def test_get_notifications(self):
        res = self.client.get("/api/notifications/1")
        self.assertEqual(res.status_code, 200)



    @patch("resources.attempts.get_attempts_for_student")
    def test_student_attempts_valid(self, mock_get_attempts):
        mock_get_attempts.return_value = [
            {"quiz_id": 1, "score": 8, "submitted_at": "2025-07-25"},
            {"quiz_id": 2, "score": 10, "submitted_at": "2025-07-26"},
        ]
        res = self.client.get("/api/student/1/attempts")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 2)
        self.assertIn("quiz_id", data[0])
        self.assertIn("score", data[0])

    @patch("resources.attempts.get_attempts_for_student")
    def test_student_attempts_empty(self, mock_get_attempts):
        mock_get_attempts.return_value = []
        res = self.client.get("/api/student/2/attempts")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json(), [])

    @patch("resources.attempts.get_attempts_for_student")
    def test_student_attempts_error(self, mock_get_attempts):
        mock_get_attempts.side_effect = Exception("Database error")
        res = self.client.get("/api/student/999/attempts")
        self.assertEqual(res.status_code, 500)
        self.assertIn("error", res.get_json())



    def test_reports(self):
        res = self.client.get("/api/reports/1")
        self.assertEqual(res.status_code, 200)

    def test_get_tips(self):
        res = self.client.get("/api/tips")
        self.assertEqual(res.status_code, 200)

    def test_viewed_tips(self):
        res = self.client.get("/api/tips/viewed/2")
        self.assertEqual(res.status_code, 200)

    def test_mark_tip_viewed(self):
        res = self.client.post("/api/tips/viewed", json={
            "parent_id": 2,
            "tip_id": 1
        })
        self.assertIn(res.status_code, [200, 201, 400])

    def test_file_complaint(self):
        res = self.client.post("/api/complaints/file", json={
            "filed_by": "student1",
            "against": "mentor1",
            "description": "Issue with doubt reply"
        })
        self.assertIn(res.status_code, [200, 201, 400])





    @patch("resources.complaints.file_complaint")
    def test_file_complaint_success(self, mock_file):
        mock_file.return_value = None
        res = self.client.post("/api/complaints/file", json={
            "filed_by": "student1",
            "against": "mentor1",
            "description": "Mentor did not respond"
        })
        self.assertEqual(res.status_code, 201)
        self.assertIn("message", res.get_json())

    def test_file_complaint_missing_fields(self):
        res = self.client.post("/api/complaints/file", json={
            "filed_by": "student1",
            "against": "mentor1"
        })
        self.assertEqual(res.status_code, 400)  # Missing description

    @patch("resources.complaints.get_complaints")
    def test_get_complaints_list(self, mock_get):
        mock_get.return_value = [
            {"id": 1, "filed_by": "student1", "against": "mentor1", "description": "Issue A"},
            {"id": 2, "filed_by": "student2", "against": "mentor2", "description": "Issue B"}
        ]
        res = self.client.get("/api/complaints")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.get_json()), 2)

    @patch("resources.complaints.get_complaints")
    def test_get_complaints_empty(self, mock_get):
        mock_get.return_value = []
        res = self.client.get("/api/complaints")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json(), [])

    @patch("resources.complaints.resolve_complaint")
    def test_resolve_complaint_success(self, mock_resolve):
        mock_resolve.return_value = None
        res = self.client.post("/api/complaints/resolve", json={
            "complaint_id": 1
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["message"], "Complaint resolved")

    def test_resolve_complaint_missing_id(self):
        res = self.client.post("/api/complaints/resolve", json={})
        self.assertEqual(res.status_code, 400)  # Missing complaint_id

    @patch("resources.complaints.soft_delete_complaint")
    def test_delete_complaint_success(self, mock_delete):
        mock_delete.return_value = True
        res = self.client.delete("/api/complaints/delete/1")
        self.assertEqual(res.status_code, 200)
        self.assertIn("deleted successfully", res.get_json()["message"])

    @patch("resources.complaints.soft_delete_complaint")
    def test_delete_complaint_not_found(self, mock_delete):
        mock_delete.return_value = False
        res = self.client.delete("/api/complaints/delete/99")
        self.assertEqual(res.status_code, 404)
        self.assertIn("not found", res.get_json()["message"])


    def test_get_complaints(self):
        res = self.client.get("/api/complaints")
        self.assertEqual(res.status_code, 200)

    def test_resolve_complaint(self):
        res = self.client.post("/api/complaints/resolve", json={
            "complaint_id": 1,
            "status": "resolved"
        })
        self.assertIn(res.status_code, [200, 400])



    def test_admin_users(self):
        res = self.client.get("/api/admin/users")
        self.assertEqual(res.status_code, 200)

    def test_pending_trainers(self):
        res = self.client.get("/api/admin/trainers/pending")
        self.assertEqual(res.status_code, 200)

    def test_pending_contents(self):
        res = self.client.get("/api/admin/contents/pending")
        self.assertEqual(res.status_code, 200)

    def test_download_user_report(self):
        res = self.client.get("/api/admin/reports/download/users")
        self.assertEqual(res.status_code, 200)

    def test_download_summary(self):
        res = self.client.get("/api/admin/reports/download/summary")
        self.assertEqual(res.status_code, 200)

    def test_block_user(self):
        res = self.client.post("/api/admin/block", json={"user_id": 1})
        self.assertIn(res.status_code, [200, 400])

    def test_unblock_user(self):
        res = self.client.post("/api/admin/unblock", json={"user_id": 1})
        self.assertIn(res.status_code, [200, 400])


    def test_post_alert(self):
        res = self.client.post("/api/alerts/post", json={"message": "Be aware of phishing attacks!"})
        self.assertIn(res.status_code, [200, 201, 400])


    def test_get_profile(self):
        res = self.client.get("/api/profile/1")
        self.assertIn(res.status_code, [200, 404])

    def test_edit_profile(self):
        res = self.client.post("/api/profile/edit", json={
            "user_id": 1,
            "username": "updated_user",
            "email": "updated@example.com"
        })
        self.assertIn(res.status_code, [200, 400])

    def test_student_activity(self):
        res = self.client.get("/api/activity/1")
        self.assertEqual(res.status_code, 200)


    def test_delete_module(self):
        res = self.client.delete("/api/modules/delete/1")
        self.assertIn(res.status_code, [200, 404])

    def test_delete_quiz(self):
        res = self.client.delete("/api/quiz/delete/1")
        self.assertIn(res.status_code, [200, 404])

    def test_delete_doubt(self):
        res = self.client.delete("/api/doubt/delete/1")
        self.assertIn(res.status_code, [200, 404])

    def test_delete_complaint(self):
        res = self.client.delete("/api/complaints/delete/1")
        self.assertIn(res.status_code, [200, 404])

    def test_delete_tip(self):
        res = self.client.delete("/api/tips/delete/1")
        self.assertIn(res.status_code, [200, 404])

    def test_delete_report(self):
        res = self.client.delete("/api/reports/delete/1")
        self.assertIn(res.status_code, [200, 404])

    def test_delete_alert(self):
        res = self.client.delete("/api/alerts/delete/1")
        self.assertIn(res.status_code, [200, 404])




    @patch("resources.admin.get_all_users")
    def test_get_all_users_valid(self, mock_users):
        mock_users.return_value = [
            {"user_id": 1, "username": "user1"},
            {"user_id": 2, "username": "user2"}
        ]
        res = self.client.get("/api/admin/users")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.get_json()), 2)

    @patch("resources.admin.get_all_users")
    def test_get_all_users_empty(self, mock_users):
        mock_users.return_value = []
        res = self.client.get("/api/admin/users")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json(), [])

    @patch("resources.admin.get_pending_trainers")
    def test_get_pending_trainers_valid(self, mock_trainers):
        mock_trainers.return_value = [
            {"user_id": 3, "username": "trainer1"},
            {"user_id": 4, "username": "trainer2"}
        ]
        res = self.client.get("/api/admin/trainers/pending")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.get_json()), 2)

    @patch("resources.admin.get_pending_contents")
    def test_get_pending_contents_valid(self, mock_contents):
        mock_contents.return_value = [
            {"content_id": 1, "title": "Module A"},
            {"content_id": 2, "title": "Module B"}
        ]
        res = self.client.get("/api/admin/contents/pending")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.get_json()), 2)

    @patch("resources.admin.download_user_report")
    def test_download_user_report_valid(self, mock_report):
        mock_report.return_value = {"report": "user_report_data"}
        res = self.client.get("/api/admin/reports/download/users")
        self.assertEqual(res.status_code, 200)
        self.assertIn("report", res.get_json())

    @patch("resources.admin.download_summary")
    def test_download_summary_valid(self, mock_summary):
        mock_summary.return_value = {"summary": "summary_data"}
        res = self.client.get("/api/admin/reports/download/summary")
        self.assertEqual(res.status_code, 200)
        self.assertIn("summary", res.get_json())

    @patch("resources.admin.block_user")
    def test_block_user_valid(self, mock_block):
        res = self.client.post("/api/admin/block", json={"user_id": 1})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json(), {"message": "User blocked"})

    def test_block_user_missing_id(self):
        res = self.client.post("/api/admin/block", json={})
        self.assertIn(res.status_code, [400, 422])

    @patch("resources.admin.unblock_user")
    def test_unblock_user_valid(self, mock_unblock):
        res = self.client.post("/api/admin/unblock", json={"user_id": 1})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json(), {"message": "User unblocked"})

    def test_unblock_user_missing_id(self):
        res = self.client.post("/api/admin/unblock", json={})
        self.assertIn(res.status_code, [400, 422])





    @patch("resources.alerts.post_alert")
    def test_post_alert_success(self, mock_post_alert):
        mock_post_alert.return_value = None  # function has no return
        res = self.client.post("/api/alerts/post", json={"message": "Stay safe online!"})
        self.assertIn(res.status_code, [200, 201])
        self.assertIn("message", res.get_json())

    def test_post_alert_missing_message(self):
        # Missing 'message' in payload
        res = self.client.post("/api/alerts/post", json={})
        self.assertEqual(res.status_code, 400)
        self.assertIn("message", res.get_json())

    @patch("resources.alerts.post_alert")
    def test_post_alert_internal_error(self, mock_post_alert):
        mock_post_alert.side_effect = Exception("DB failure")
        res = self.client.post("/api/alerts/post", json={"message": "Hello"})
        self.assertEqual(res.status_code, 500)
        self.assertIn("error", res.get_json())

    @patch("resources.alerts.soft_delete_alert")
    def test_delete_alert_success(self, mock_delete_alert):
        mock_delete_alert.return_value = True
        res = self.client.delete("/api/alerts/delete/1")
        self.assertEqual(res.status_code, 200)
        self.assertIn("message", res.get_json())
        self.assertIn("deleted", res.get_json()["message"])

    @patch("resources.alerts.soft_delete_alert")
    def test_delete_alert_not_found(self, mock_delete_alert):
        mock_delete_alert.return_value = False
        res = self.client.delete("/api/alerts/delete/999")
        self.assertEqual(res.status_code, 404)
        self.assertIn("not found", res.get_json()["message"])

    @patch("resources.alerts.soft_delete_alert")
    def test_delete_alert_internal_error(self, mock_delete_alert):
        mock_delete_alert.side_effect = Exception("DB error")
        res = self.client.delete("/api/alerts/delete/5")
        self.assertEqual(res.status_code, 500)
        self.assertIn("error", res.get_json())



    @patch("resources.doubts.ask_doubt")
    def test_ask_doubt_success(self, mock_ask_doubt):
        mock_ask_doubt.return_value = None  # Function doesn't return anything
        res = self.client.post("/api/doubt", json={
            "student_id": 1,
            "mentor_id": 3,
            "module_id": 1,
            "question": "What is malware?"
        })
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.get_json()["message"], "Doubt submitted successfully")

    @patch("resources.doubts.ask_doubt")
    def test_ask_doubt_missing_fields(self, mock_ask_doubt):
        res = self.client.post("/api/doubt", json={
            "student_id": 1,
            "mentor_id": 3
            # missing module_id and question
        })
        self.assertEqual(res.status_code, 400)  # If you add proper validation
        # If no validation, patch should still run, so this might pass as 201

    @patch("resources.doubts.get_doubts_for_mentor")
    def test_get_mentor_doubts_success(self, mock_get_doubts):
        mock_get_doubts.return_value = [
            {"doubt_id": 1, "question": "What is malware?", "answer": None},
            {"doubt_id": 2, "question": "Define phishing", "answer": "Fake emails"}
        ]
        res = self.client.get("/api/doubts/3")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.get_json()), 2)

    @patch("resources.doubts.get_doubts_for_mentor")
    def test_get_mentor_doubts_empty(self, mock_get_doubts):
        mock_get_doubts.return_value = []
        res = self.client.get("/api/doubts/999")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json(), [])

    @patch("resources.doubts.reply_to_doubt")
    def test_reply_to_doubt_success(self, mock_reply):
        mock_reply.return_value = None
        res = self.client.post("/api/doubt/reply", json={
            "doubt_id": 1,
            "answer": "Malware is software designed to harm systems."
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["message"], "Reply submitted successfully")

    @patch("resources.doubts.reply_to_doubt")
    def test_reply_to_doubt_missing_fields(self, mock_reply):
        res = self.client.post("/api/doubt/reply", json={
            "doubt_id": 1
            # missing answer
        })
        self.assertEqual(res.status_code, 400)  # if input validation is present

    @patch("resources.doubts.soft_delete_doubt")
    def test_delete_doubt_success(self, mock_delete):
        mock_delete.return_value = True
        res = self.client.delete("/api/doubt/delete/1")
        self.assertEqual(res.status_code, 200)
        self.assertIn("deleted successfully", res.get_json()["message"])

    @patch("resources.doubts.soft_delete_doubt")
    def test_delete_doubt_not_found(self, mock_delete):
        mock_delete.return_value = False
        res = self.client.delete("/api/doubt/delete/999")
        self.assertEqual(res.status_code, 404)
        self.assertIn("not found", res.get_json()["message"])






    @patch("resources.modules.get_all_modules")
    def test_get_modules_success(self, mock_get_modules):
        mock_get_modules.return_value = [
            {"module_id": 1, "title": "Cyber Hygiene", "description": "Basics of cyber safety"},
            {"module_id": 2, "title": "Cyber Ethics", "description": "Being ethical online"}
        ]

        res = self.client.get("/api/modules")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 2)
        self.assertIn("title", data[0])

    @patch("resources.modules.get_all_modules")
    def test_get_modules_empty(self, mock_get_modules):
        mock_get_modules.return_value = []
        res = self.client.get("/api/modules")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json(), [])

    @patch("resources.modules.soft_delete_module")
    def test_delete_module_success(self, mock_delete):
        mock_delete.return_value = True
        res = self.client.delete("/api/modules/delete/1")
        self.assertEqual(res.status_code, 200)
        self.assertIn("deleted successfully", res.get_json()["message"])

    @patch("resources.modules.soft_delete_module")
    def test_delete_module_not_found(self, mock_delete):
        mock_delete.return_value = False
        res = self.client.delete("/api/modules/delete/99")
        self.assertEqual(res.status_code, 404)
        self.assertIn("not found", res.get_json()["message"])

    @patch("resources.modules.upload_module_content")
    def test_upload_module_success(self, mock_upload):
        mock_upload.return_value = None  # upload_module_content doesn't return anything
        res = self.client.post("/api/modules/upload", json={
            "mentor_id": 1,
            "title": "Cyber Safety for Teens",
            "description": "Learn about cyber threats.",
            "video_url": "https://youtube.com/video123",
            "resource_link": "https://example.com/resources"
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("uploaded successfully", res.get_json()["message"])

    @patch("resources.modules.upload_module_content")
    def test_upload_module_missing_fields(self, mock_upload):
        res = self.client.post("/api/modules/upload", json={
            "mentor_id": 1,
            # title is missing
            "description": "Missing title field"
        })
        self.assertEqual(res.status_code, 200)  # Adjust this if you later validate required fields



@patch("resources.notifications.get_notifications")
def test_notifications_valid(self, mock_notifs):
    mock_notifs.return_value = [
        {"id": 1, "user_id": 1, "message": "Welcome!", "read": False},
        {"id": 2, "user_id": 1, "message": "Quiz posted", "read": True}
    ]
    res = self.client.get("/api/notifications/1")
    self.assertEqual(res.status_code, 200)
    data = res.get_json()
    self.assertIsInstance(data, list)
    self.assertEqual(len(data), 2)
    self.assertEqual(data[0]["message"], "Welcome!")

@patch("resources.notifications.get_notifications")
def test_notifications_empty(self, mock_notifs):
    mock_notifs.return_value = []
    res = self.client.get("/api/notifications/1")
    self.assertEqual(res.status_code, 200)
    data = res.get_json()
    self.assertEqual(data, [])

@patch("resources.notifications.get_notifications")
def test_notifications_error(self, mock_notifs):
    mock_notifs.side_effect = Exception("DB connection failed")
    res = self.client.get("/api/notifications/1")
    self.assertEqual(res.status_code, 500)
    data = res.get_json()
    self.assertIn("error", data)



    @patch("resources.profile.get_profile_details")
    def test_get_profile_valid(self, mock_get_profile):
        mock_get_profile.return_value = {
            "user_id": 1,
            "username": "test_user",
            "email": "test@example.com",
            "role": "student"
        }
        res = self.client.get("/api/profile/1")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["user_id"], 1)
        self.assertEqual(data["username"], "test_user")

    @patch("resources.profile.get_profile_details")
    def test_get_profile_error(self, mock_get_profile):
        mock_get_profile.side_effect = Exception("User not found")
        res = self.client.get("/api/profile/999")
        self.assertEqual(res.status_code, 500)
        self.assertIn("error", res.get_json())

    @patch("resources.profile.update_profile_details")
    def test_edit_profile_valid_full_update(self, mock_update):
        mock_update.return_value = None  # assume successful update
        res = self.client.post("/api/profile/edit", json={
            "user_id": 1,
            "username": "new_name",
            "email": "new_email@example.com"
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("message", res.get_json())

    @patch("resources.profile.update_profile_details")
    def test_edit_profile_valid_partial_update(self, mock_update):
        res = self.client.post("/api/profile/edit", json={
            "user_id": 1,
            "password": "new_password"
        })
        self.assertEqual(res.status_code, 200)
        self.assertIn("message", res.get_json())

    @patch("resources.profile.update_profile_details")
    def test_edit_profile_missing_user_id(self, mock_update):
        res = self.client.post("/api/profile/edit", json={
            "username": "incomplete_user"
        })
        self.assertEqual(res.status_code, 400)  # reqparse fails with 400

    @patch("resources.profile.update_profile_details")
    def test_edit_profile_error_in_update(self, mock_update):
        mock_update.side_effect = Exception("Database error")
        res = self.client.post("/api/profile/edit", json={
            "user_id": 1,
            "email": "crash@example.com"
        })
        self.assertEqual(res.status_code, 500)
        self.assertIn("error", res.get_json())


@patch("resources.quiz.get_quiz_with_questions")
def test_get_quiz_success(self, mock_get_quiz):
    mock_get_quiz.return_value = {
        "quiz_id": 1,
        "title": "Cyber Safety",
        "questions": [
            {"question_id": 1, "text": "What is phishing?"}
        ]
    }
    res = self.client.get("/api/quiz/1")
    self.assertEqual(res.status_code, 200)
    self.assertIn("questions", res.get_json())

@patch("resources.quiz.get_quiz_with_questions")
def test_get_quiz_not_found(self, mock_get_quiz):
    mock_get_quiz.return_value = None
    res = self.client.get("/api/quiz/999")
    self.assertEqual(res.status_code, 404)
    self.assertIn("error", res.get_json())

@patch("resources.quiz.evaluate_quiz")
@patch("resources.quiz.save_quiz_attempt")
def test_submit_quiz_success(self, mock_save, mock_evaluate):
    mock_evaluate.return_value = {"score": 2, "total": 3}
    res = self.client.post("/api/quiz/submit", json={
        "student_id": 1,
        "quiz_id": 1,
        "answers": {"1": 2, "2": 3}
    })
    self.assertEqual(res.status_code, 200)
    self.assertIn("score", res.get_json())

def test_submit_quiz_missing_fields(self):
    res = self.client.post("/api/quiz/submit", json={
        "student_id": 1,
        "answers": {"1": 2}
    })
    self.assertEqual(res.status_code, 400)
    self.assertIn("error", res.get_json())

@patch("resources.quiz.create_quiz_with_questions")
def test_create_quiz_success(self, mock_create_quiz):
    mock_create_quiz.return_value = None
    res = self.client.post("/api/quiz/create", json={
        "title": "Cyber Safety Quiz",
        "module_id": 1,
        "questions": [
            {"text": "What is malware?", "options": ["A", "B"], "correct_option": 0}
        ]
    })
    self.assertEqual(res.status_code, 201)
    self.assertIn("message", res.get_json())

def test_create_quiz_missing_fields(self):
    res = self.client.post("/api/quiz/create", json={
        "title": "Incomplete Quiz"
    })
    self.assertEqual(res.status_code, 400)
    self.assertIn("error", res.get_json())

@patch("resources.quiz.create_quiz_with_questions")
def test_create_quiz_exception(self, mock_create_quiz):
    mock_create_quiz.side_effect = Exception("DB error")
    res = self.client.post("/api/quiz/create", json={
        "title": "Cyber Quiz",
        "module_id": 1,
        "questions": []
    })
    self.assertEqual(res.status_code, 500)
    self.assertIn("error", res.get_json())

@patch("resources.quiz.soft_delete_quiz")
def test_delete_quiz_success(self, mock_delete):
    mock_delete.return_value = True
    res = self.client.delete("/api/quiz/delete/1")
    self.assertEqual(res.status_code, 200)
    self.assertIn("message", res.get_json())

@patch("resources.quiz.soft_delete_quiz")
def test_delete_quiz_not_found(self, mock_delete):
    mock_delete.return_value = False
    res = self.client.delete("/api/quiz/delete/999")
    self.assertEqual(res.status_code, 404)
    self.assertIn("message", res.get_json())


    @patch("resources.reports.get_reports_for_student")
    def test_get_reports_valid(self, mock_get_reports):
        mock_get_reports.return_value = [
            {"report_id": 1, "student_id": 1, "content": "Cyberbullying case"},
            {"report_id": 2, "student_id": 1, "content": "Phishing incident"}
        ]

        res = self.client.get("/api/reports/1")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["student_id"], 1)

    @patch("resources.reports.get_reports_for_student")
    def test_get_reports_empty(self, mock_get_reports):
        mock_get_reports.return_value = []

        res = self.client.get("/api/reports/999")  # assuming no reports
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 0)

    @patch("resources.reports.get_reports_for_student")
    def test_get_reports_error(self, mock_get_reports):
        mock_get_reports.side_effect = Exception("DB error")

        res = self.client.get("/api/reports/1")
        self.assertEqual(res.status_code, 500)
        data = res.get_json()
        self.assertIn("error", data)

    @patch("resources.reports.soft_delete_report")
    def test_delete_report_success(self, mock_soft_delete):
        mock_soft_delete.return_value = True

        res = self.client.delete("/api/reports/delete/1")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("message", data)

    @patch("resources.reports.soft_delete_report")
    def test_delete_report_not_found(self, mock_soft_delete):
        mock_soft_delete.return_value = False

        res = self.client.delete("/api/reports/delete/999")
        self.assertEqual(res.status_code, 404)
        data = res.get_json()
        self.assertIn("message", data)

    @patch("resources.reports.soft_delete_report")
    def test_delete_report_error(self, mock_soft_delete):
        mock_soft_delete.side_effect = Exception("Something went wrong")

        res = self.client.delete("/api/reports/delete/1")
        self.assertEqual(res.status_code, 500)
        data = res.get_json()
        self.assertIn("error", data)



    @patch("resources.tips.get_all_tips")
    def test_get_all_tips(self, mock_get_all_tips):
        mock_get_all_tips.return_value = [
            {"tip_id": 1, "title": "Use strong passwords"},
            {"tip_id": 2, "title": "Beware of phishing"}
        ]
        res = self.client.get("/api/tips")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 2)

    @patch("resources.tips.get_viewed_tips_by_parent")
    def test_get_viewed_tips(self, mock_get_viewed):
        mock_get_viewed.return_value = [
            {"tip_id": 1, "title": "Use strong passwords"}
        ]
        res = self.client.get("/api/tips/viewed/2")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(data[0]["tip_id"], 1)

    @patch("resources.tips.mark_tip_viewed")
    def test_mark_tip_viewed_success(self, mock_mark_viewed):
        mock_mark_viewed.return_value = None  # It's a void function
        res = self.client.post("/api/tips/viewed", json={
            "parent_id": 2,
            "tip_id": 1
        })
        self.assertIn(res.status_code, [200, 201])
        data = res.get_json()
        self.assertEqual(data["message"], "Tip marked as viewed")

    @patch("resources.tips.mark_tip_viewed")
    def test_mark_tip_viewed_missing_fields(self, mock_mark_viewed):
        res = self.client.post("/api/tips/viewed", json={
            "parent_id": 2
        })
        self.assertEqual(res.status_code, 400)

    @patch("resources.tips.soft_delete_tip")
    def test_delete_tip_success(self, mock_delete_tip):
        mock_delete_tip.return_value = True
        res = self.client.delete("/api/tips/delete/1")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("Tip 1 deleted successfully", data["message"])

    @patch("resources.tips.soft_delete_tip")
    def test_delete_tip_not_found(self, mock_delete_tip):
        mock_delete_tip.return_value = False
        res = self.client.delete("/api/tips/delete/99")
        self.assertEqual(res.status_code, 404)
        data = res.get_json()
        self.assertIn("Tip 99 not found", data["message"])


if __name__ == "__main__":
    unittest.main()
