'''from flask_restful import Resource
from flask import request
from models import get_quiz_with_questions, evaluate_quiz, save_quiz_attempt, create_quiz_with_questions
from flask_restful import Resource
from models import soft_delete_quiz  

from flask_restful import Resource
from models import soft_delete_quiz

class DeleteQuizAPI(Resource):
    def delete(self, quiz_id):
        
        result = soft_delete_quiz(quiz_id)
        if result:
            return {'message': 'Quiz deleted successfully'}, 200
        else:
            return {'message': 'Quiz not found'}, 404


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
        try:
            data = request.get_json()
            print(" Received data for quiz creation:", data)  # Log incoming data

            if not data or 'title' not in data or 'module_id' not in data or 'questions' not in data:
                return {"error": "Missing required fields (title, module_id, questions)"}, 400

            create_quiz_with_questions(data)
            return {"message": " Quiz created and uploaded successfully"}, 201

        except Exception as e:
            print(" Exception while creating quiz:", str(e))
            return {"error": "Failed to create quiz", "details": str(e)}, 500
'''

from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required
from models import (
    get_quiz_with_questions,
    evaluate_quiz,
    save_quiz_attempt,
    create_quiz_with_questions,
    soft_delete_quiz
)

class DeleteQuizAPI(Resource):
    @jwt_required()
    def delete(self, quiz_id):
        """Delete quiz by ID (soft delete)"""
        result = soft_delete_quiz(quiz_id)
        if result:
            return {'message': 'Quiz deleted successfully'}, 200
        else:
            return {'message': 'Quiz not found'}, 404


class QuizAPI(Resource):
    @jwt_required()
    def get(self, user_id):
        """Get quiz with questions"""
        quiz = get_quiz_with_questions(user_id)
        if not quiz:
            return {"error": "Quiz not found"}, 404
        print(quiz)
        return quiz


class QuizSubmitAPI(Resource):
    @jwt_required()
    def post(self):
        """Submit a quiz attempt"""
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
    @jwt_required()
    def post(self):
        """Create a quiz with questions"""
        try:
            data = request.get_json()
            print("Received data for quiz creation:", data)  # Debug log

            if not data or 'title' not in data or 'module_id' not in data or 'questions' not in data:
                return {"error": "Missing required fields (title, module_id, questions)"}, 400

            create_quiz_with_questions(data)
            return {"message": "Quiz created and uploaded successfully"}, 201

        except Exception as e:
            print("Exception while creating quiz:", str(e))
            return {"error": "Failed to create quiz", "details": str(e)}, 500