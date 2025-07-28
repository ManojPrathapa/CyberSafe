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
        reply_to_doubt(doubt_id, answer)
        return {"message": "Reply submitted successfully"}'''



class DeleteDoubtAPI(Resource):
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
        return {"message": "Reply submitted successfully"}, 200
