from flask_restful import Resource
from models import get_notifications

class NotificationAPI(Resource):
    def get(self, user_id):
        notifs = get_notifications(user_id)
        return [dict(n) for n in notifs]