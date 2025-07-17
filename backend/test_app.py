import unittest 
from app import app

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

    def test_student_attempts(self):
        res = self.client.get("/api/student/1/attempts")
        self.assertEqual(res.status_code, 200)

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

    def test_get_complaints(self):
        res = self.client.get("/api/complaints")
        self.assertEqual(res.status_code, 200)

    def test_resolve_complaint(self):
        res = self.client.post("/api/complaints/resolve", json={
            "complaint_id": 1,
            "status": "resolved"
        })
        self.assertIn(res.status_code, [200, 400])

    # --------------------
    # 🔐 Admin Endpoints
    # --------------------

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

    # --------------------
    # 📣 Alerts
    # --------------------
    def test_post_alert(self):
        res = self.client.post("/api/alerts/post", json={"message": "Be aware of phishing attacks!"})
        self.assertIn(res.status_code, [200, 201, 400])

    # --------------------
    # 👤 Profile & Activity
    # --------------------
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

    # --------------------
    # ❌ DELETE (Soft Deletes)
    # --------------------
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

if __name__ == "__main__":
    unittest.main()
