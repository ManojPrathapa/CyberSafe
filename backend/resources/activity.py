from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import get_student_activity, get_parent_children_activity, get_parent_dashboard_data

class StudentActivityAPI(Resource):
    @jwt_required()  # <-- Require a valid JWT to access
    def get(self, student_id):
        try:
            return get_student_activity(student_id), 200
        
        except ValueError as ve:
            # Student does not exist
            return {"error": str(ve)}, 400
        
        except Exception as e:
            # Unexpected server error
            return {"error": str(e)}, 500

class ParentChildrenActivityAPI(Resource):
    @jwt_required()
    def get(self, parent_id):
        """Get activity data for all children linked to a parent (JWT required)"""
        try:
            children_activity = get_parent_children_activity(parent_id)
            return children_activity, 200
        except Exception as e:
            return {"error": str(e)}, 500

class ParentDashboardAPI(Resource):
    @jwt_required()
    def get(self, parent_id):
        """Get comprehensive dashboard data for a parent (JWT required)"""
        try:
            dashboard_data = get_parent_dashboard_data(parent_id)
            return dashboard_data, 200
        except Exception as e:
            return {"error": str(e)}, 500
