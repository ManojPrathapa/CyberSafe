from flask_restful import Resource
from flask import request
from models import get_quiz_with_questions, evaluate_quiz, save_quiz_attempt, create_quiz_with_questions

class QuizAPI(Resource):
    def get(self, quiz_id):
        quiz = get_quiz_with_questions(quiz_id)
        if not quiz:
            return {"error": "Quiz not found"}, 404
        return quiz

class QuizSubmitAPI(Resource):
    def post(self):
        data = request.get_json()
        quiz_id = data.get("quiz_id")
        student_id = data.get("student_id")
        answers = data.get("answers")

        if not quiz_id or not student_id or not answers:
            return {"error": "Missing quiz_id, student_id, or answers"}, 400

        result = evaluate_quiz(quiz_id, answers)
        save_quiz_attempt(student_id, quiz_id, answers, result["score"])

        return {
            "message": "Quiz submitted successfully",
            "score": result["score"],
            "total": result["total"]
        }

class QuizCreateAPI(Resource):
    def post(self):
        data = request.get_json()
        create_quiz_with_questions(data)
        return {"message": "Quiz created and uploaded successfully"}