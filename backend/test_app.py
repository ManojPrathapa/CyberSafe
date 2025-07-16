import unittest
from app import app

class TestCYBERSAFEAPI(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

        # Register a fresh test user for login test
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
        self.assertIn(res.status_code, [200, 201, 400])  # 400 if duplicate

    def test_login(self):
        payload = {
            "username": self.test_username,
            "password": self.test_password
        }
        res = self.client.post("/api/login", json=payload)
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
        self.assertEqual(res.status_code, 200)

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
        self.assertIn(res.status_code, [200, 201])

    def test_file_complaint(self):
        res = self.client.post("/api/complaints/file", json={
            "filed_by": "student1",
            "against": "mentor1",
            "description": "Issue with doubt reply"
        })
        self.assertIn(res.status_code, [200, 201])

    def test_get_complaints(self):
        res = self.client.get("/api/complaints")
        self.assertEqual(res.status_code, 200)

    def test_resolve_complaint(self):
        res = self.client.post("/api/complaints/resolve", json={
            "complaint_id": 1,
            "status": "resolved"
        })
        self.assertIn(res.status_code, [200, 400])

if __name__ == "__main__":
    unittest.main()
