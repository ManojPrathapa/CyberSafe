from flask_restful import Resource
from models import get_attempts_for_student

'''class StudentAttemptsAPI(Resource):
    def get(self, student_id):
        attempts = get_attempts_for_student(student_id)
        return [dict(a) for a in attempts]'''



class StudentAttemptsAPI(Resource):
    def get(self, student_id):
        try:
            attempts = get_attempts_for_student(student_id)
            return [dict(a) for a in attempts], 200
        except Exception as e:
            return {"error": str(e)}, 500
