from flask_restful import Resource
from models import get_reports_for_student
from flask_restful import Resource
from models import soft_delete_report 

class DeleteReportAPI(Resource):
    def delete(self, report_id):
        result = soft_delete_report(report_id)
        if result:
            return {'message': f'Report {report_id} deleted successfully'}, 200
        return {'message': f'Report {report_id} not found or already deleted'}, 404


class StudentReportAPI(Resource):
    def get(self, student_id):
        reports = get_reports_for_student(student_id)
        return [dict(r) for r in reports]