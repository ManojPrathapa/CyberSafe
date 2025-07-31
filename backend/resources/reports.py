'''from flask_restful import Resource
from models import get_reports_for_student
from flask_restful import Resource
from models import soft_delete_report 


from flask_restful import Resource
from models import get_reports_for_student, soft_delete_report

class DeleteReportAPI(Resource):
    def delete(self, report_id):
        try:
            result = soft_delete_report(report_id)
            if result:
                return {'message': f'Report {report_id} deleted successfully'}, 200
            return {'message': f'Report {report_id} not found or already deleted'}, 404
        except Exception as e:
            return {"error": str(e)}, 500

class StudentReportAPI(Resource):
    def get(self, student_id):
        try:
            reports = get_reports_for_student(student_id)
            return [dict(r) for r in reports], 200
        except Exception as e:
            return {"error": str(e)}, 500
        '''

from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import get_reports_for_student, soft_delete_report


class DeleteReportAPI(Resource):
    @jwt_required()
    def delete(self, report_id):
        """Soft delete a report by ID (JWT required, any logged-in user)"""
        try:
            result = soft_delete_report(report_id)
            if result:
                return {'message': f'Report {report_id} deleted successfully'}, 200
            return {'message': f'Report {report_id} not found or already deleted'}, 404
        except Exception as e:
            return {"error": str(e)}, 500


class StudentReportAPI(Resource):
    @jwt_required()
    def get(self, student_id):
        """Get all reports for a student (JWT required)"""
        try:
            reports = get_reports_for_student(student_id)
            return [dict(r) for r in reports], 200
        except Exception as e:
            return {"error": str(e)}, 500

        
