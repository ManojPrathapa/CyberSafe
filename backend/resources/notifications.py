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

'''from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import get_notifications

class NotificationAPI(Resource):
    @jwt_required()  # Only authentication required, no role check
    def get(self, user_id):
        try:
            notifs = get_notifications(user_id)
            return [dict(n) for n in notifs], 200
        except Exception as e:
            return {"error": str(e)}, 500'''


from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models import (
    create_notification,
    get_notifications,
    mark_notification_read,
    delete_notification
)

# Parser for creating notifications
create_parser = reqparse.RequestParser()
create_parser.add_argument("user_id", type=int, required=True)
create_parser.add_argument("type", type=str, required=True)  # alert, doubt, complaint, quiz, admin, mentor
create_parser.add_argument("message", type=str, required=True)
create_parser.add_argument("related_id", type=int, required=False)

class NotificationListAPI(Resource):
    @jwt_required()
    def get(self, user_id):
        try:
            notifs = get_notifications(user_id)
            return [dict(n) for n in notifs], 200
        except Exception as e:
            return {"error": str(e)}, 500

    @jwt_required()
    def post(self):
        data = create_parser.parse_args()
        try:
            create_notification(
                data["user_id"], 
                data["type"], 
                data["message"], 
                data.get("related_id")
            )
            return {"message": "Notification created successfully"}, 201
        except Exception as e:
            return {"error": str(e)}, 500


class NotificationDetailAPI(Resource):
    @jwt_required()
    def patch(self, notif_id):
        """Mark as read"""
        try:
            mark_notification_read(notif_id)
            return {"message": "Notification marked as read"}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    @jwt_required()
    def delete(self, notif_id):
        """Soft delete notification"""
        try:
            delete_notification(notif_id)
            return {"message": "Notification deleted successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500