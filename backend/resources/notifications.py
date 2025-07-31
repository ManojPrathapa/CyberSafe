'''from flask_restful import Resource
from models import get_notifications


class NotificationAPI(Resource):
    def get(self, user_id):
        try:
            notifs = get_notifications(user_id)
            return [dict(n) for n in notifs], 200
        except Exception as e:
            return {"error": str(e)}, 500
'''

from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import get_notifications

class NotificationAPI(Resource):
    @jwt_required()  # Only authentication required, no role check
    def get(self, user_id):
        try:
            notifs = get_notifications(user_id)
            return [dict(n) for n in notifs], 200
        except Exception as e:
            return {"error": str(e)}, 500
