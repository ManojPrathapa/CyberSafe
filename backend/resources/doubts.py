from flask_restful import Resource, reqparse
from flask import request
from models import ask_doubt, get_doubts_for_mentor

class AskDoubtAPI(Resource):
    def post(self):
        data = request.get_json()
        student_id = data.get("student_id")
        mentor_id = data.get("mentor_id")
        module_id = data.get("module_id")
        question = data.get("question")

        ask_doubt(student_id, mentor_id, module_id, question)
        return {"message": "Doubt submitted successfully"}

class MentorDoubtAPI(Resource):
    def get(self, mentor_id):
        doubts = get_doubts_for_mentor(mentor_id)
        return [dict(d) for d in doubts]