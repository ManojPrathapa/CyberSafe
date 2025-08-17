from flask_restful import Resource, reqparse
from models import get_user_preferences, update_user_preferences

class UserPreferencesAPI(Resource):
    def get(self, user_id):
        prefs = get_user_preferences(user_id)
        if not prefs:
            return {"error": "Preferences not found"}, 404
        return prefs, 200

    def put(self, user_id):
        parser = reqparse.RequestParser()
        parser.add_argument("theme")
        parser.add_argument("notification_email", type=int)
        parser.add_argument("notification_push", type=int)
        parser.add_argument("notification_sms", type=int)
        parser.add_argument("frequency")
        args = parser.parse_args()

        update_user_preferences(user_id, args)
        return {"message": "Preferences updated"}, 200
