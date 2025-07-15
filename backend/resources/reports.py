from flask_restful import Resource
from models import get_reports_for_student

class StudentReportAPI(Resource):
    def get(self, student_id):
        reports = get_reports_for_student(student_id)
        return [dict(r) for r in reports]