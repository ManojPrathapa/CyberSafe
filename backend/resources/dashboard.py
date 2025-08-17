from flask_restful import Resource
from models import get_parent_dashboard

class ParentDashboardAPI(Resource):
    def get(self, parent_id):
        return get_parent_dashboard(parent_id), 200
