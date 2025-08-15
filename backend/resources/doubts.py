from flask_restful import Resource, reqparse
from flask import request
from models import ask_doubt, get_doubts_for_mentor, reply_to_doubt
from flask_restful import Resource
from models import soft_delete_doubt  

from flask_restful import Resource
from flask import request
from models import (
    ask_doubt,
    get_doubts_for_mentor,
    reply_to_doubt,
    soft_delete_doubt
)

'''class DeleteDoubtAPI(Resource):
    def delete(self, doubt_id):
        result = soft_delete_doubt(doubt_id)
        if result:
            return {'message': f'Doubt {doubt_id} deleted successfully'}, 200
        return {'message': f'Doubt {doubt_id} not found or already deleted'}, 404


class AskDoubtAPI(Resource):
    def post(self):
        data = request.get_json()
        student_id = data.get("student_id")
        mentor_id = data.get("mentor_id")
        module_id = data.get("module_id")
        question = data.get("question")

        if not all([student_id, mentor_id, module_id, question]):
            return {"message": "Missing required fields"}, 400

        ask_doubt(student_id, mentor_id, module_id, question)
        return {"message": "Doubt submitted successfully"}, 201


class MentorDoubtAPI(Resource):
    def get(self, mentor_id):
        doubts = get_doubts_for_mentor(mentor_id)
        return [dict(d) for d in doubts]


class ReplyToDoubtAPI(Resource):
    def post(self):
        data = request.get_json()
        doubt_id = data.get("doubt_id")
        answer = data.get("answer")

        if not doubt_id or not answer:
            return {"message": "Missing required fields"}, 400

        reply_to_doubt(doubt_id, answer)
        return {"message": "Reply submitted successfully"}, 200'''


'''from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required
from models import (
    ask_doubt,
    get_doubts_for_mentor,
    reply_to_doubt,
    soft_delete_doubt
)


class AskDoubtAPI(Resource):
    @jwt_required()
    def post(self):
        """Student asks a doubt"""
        data = request.get_json()
        student_id = data.get("student_id")
        mentor_id = data.get("mentor_id")
        module_id = data.get("module_id")
        question = data.get("question")

        if not all([student_id, mentor_id, module_id, question]):
            return {"message": "Missing required fields"}, 400

        ask_doubt(student_id, mentor_id, module_id, question)
        return {"message": "Doubt submitted successfully"}, 201


class MentorDoubtAPI(Resource):
    @jwt_required()
    def get(self, mentor_id):
        """Mentor fetches doubts assigned to them"""
        doubts = get_doubts_for_mentor(mentor_id)
        return [dict(d) for d in doubts], 200


class ReplyToDoubtAPI(Resource):
    @jwt_required()
    def post(self):
        """Mentor replies to a doubt"""
        data = request.get_json()
        doubt_id = data.get("doubt_id")
        answer = data.get("answer")

        if not doubt_id or not answer:
            return {"message": "Missing required fields"}, 400

        reply_to_doubt(doubt_id, answer)
        return {"message": "Reply submitted successfully"}, 200


class DeleteDoubtAPI(Resource):
    @jwt_required()
    def delete(self, doubt_id):
        """Soft delete a doubt"""
        result = soft_delete_doubt(doubt_id)
        if result:
            return {'message': f'Doubt {doubt_id} deleted successfully'}, 200
        return {'message': f'Doubt {doubt_id} not found or already deleted'}, 404'''

from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required
from models import (
    ask_doubt,
    get_doubts_for_mentor,
    reply_to_doubt,
    soft_delete_doubt
)
from helpers.notifications_helper import send_notification

class AskDoubtAPI(Resource):
    @jwt_required()
    def post(self):
        """Student asks a doubt"""
        data = request.get_json()
        student_id = data.get("student_id")
        mentor_id = data.get("mentor_id")
        module_id = data.get("module_id")
        question = data.get("question")

        if not all([student_id, mentor_id, module_id, question]):
            return {"message": "Missing required fields"}, 400

        # Insert doubt into DB and get doubt_id
        doubt_id = ask_doubt(student_id, mentor_id, module_id, question)

        # Trigger notification: Student -> Mentor
        send_notification(
            event_type="doubt_student",
            related_id=doubt_id,
            mentor_id=mentor_id,
            message=f"New doubt posted by student {student_id}"
        )

        return {"message": "Doubt submitted successfully"}, 201


class MentorDoubtAPI(Resource):
    @jwt_required()
    def get(self, mentor_id):
        """Mentor fetches doubts assigned to them"""
        doubts = get_doubts_for_mentor(mentor_id)
        return [dict(d) for d in doubts], 200


class ReplyToDoubtAPI(Resource):
    @jwt_required()
    def post(self):
        """Mentor replies to a doubt"""
        data = request.get_json()
        doubt_id = data.get("doubt_id")
        answer = data.get("answer")
        student_id = data.get("student_id")  # required for notification

        if not doubt_id or not answer or not student_id:
            return {"message": "Missing required fields (doubt_id, answer, student_id)"}, 400

        # Save mentor reply
        reply_to_doubt(doubt_id, answer)

        # Trigger notification: Mentor -> Student
        send_notification(
            event_type="doubt_mentor",
            related_id=doubt_id,
            student_id=student_id,
            message="Your doubt has been answered by mentor"
        )

        return {"message": "Reply submitted successfully"}, 200


class DeleteDoubtAPI(Resource):
    @jwt_required()
    def delete(self, doubt_id):
        """Soft delete a doubt"""
        result = soft_delete_doubt(doubt_id)
        if result:
            return {'message': f'Doubt {doubt_id} deleted successfully'}, 200
        return {'message': f'Doubt {doubt_id} not found or already deleted'}, 404
