

from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import get_attempts_for_student

class StudentAttemptsAPI(Resource):
    @jwt_required()
    def get(self, student_id):
        """Return all quiz attempts for a student (JWT required, no role restriction)."""
        try:
            attempts = get_attempts_for_student(student_id)
            return [dict(a) for a in attempts], 200
        except Exception as e:
            return {"error": str(e)}, 500
