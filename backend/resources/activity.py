'''from flask_restful import Resource
from models import get_student_activity
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_student_activity


class StudentActivityAPI(Resource):
    def get(self, student_id):
        try:
            return get_student_activity(student_id), 200
        except Exception as e:
            return {"error": str(e)}, 500
        
        

'''

from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import get_student_activity

class StudentActivityAPI(Resource):
    @jwt_required()  # <-- Require a valid JWT to access
    def get(self, student_id):
        try:
            return get_student_activity(student_id), 200
        except Exception as e:
            return {"error": str(e)}, 500
