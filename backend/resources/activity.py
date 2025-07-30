from flask_restful import Resource
from models import get_student_activity



class StudentActivityAPI(Resource):
    def get(self, student_id):
        try:
            return get_student_activity(student_id), 200
        except Exception as e:
            return {"error": str(e)}, 500
