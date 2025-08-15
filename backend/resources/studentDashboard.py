from flask import jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import (
    get_student_scores,
    get_student_time_spent,
    get_student_doubts,
    get_module_progress
)

class StudentDashboardAPI(Resource):
    @jwt_required()
    def get(self, student_id):
        scores = get_student_scores(student_id)
        time_spent = get_student_time_spent(student_id)
        doubts = get_student_doubts(student_id)
        progress = get_module_progress(student_id)

        return jsonify({
            "scores": scores,
            "timeSpent": time_spent,
            "doubts": doubts,
            "progress": progress
        })
