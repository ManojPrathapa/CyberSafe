from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models import get_user_theme, set_user_theme, get_user_notification_preferences, set_user_notification_preferences

class ThemePrefsAPI(Resource):
    # GET /api/prefs/theme/<user_id>
    @jwt_required()
    def get(self, user_id):
        try:
            theme = get_user_theme(user_id)
            return {"user_id": user_id, "theme": theme}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    # POST /api/prefs/theme
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("user_id", type=int, required=True)
        parser.add_argument("theme", required=True, choices=("system", "light", "dark"))
        args = parser.parse_args()
        try:
            set_user_theme(args["user_id"], args["theme"])
            return {"message": "Theme saved"}, 200
        except ValueError as ve:
            return {"error": str(ve)}, 400
        except Exception as e:
            return {"error": str(e)}, 500


class NotificationPrefsAPI(Resource):
    # GET /api/prefs/notifications/<user_id>
    @jwt_required()
    def get(self, user_id):
        try:
            preferences = get_user_notification_preferences(user_id)
            return {
                "user_id": user_id,
                "email_enabled": preferences["notification_email"],
                "push_enabled": preferences["notification_push"],
                "sms_enabled": preferences["notification_sms"],
                "frequency": preferences["frequency"]
            }, 200
        except Exception as e:
            return {"error": str(e)}, 500

    # POST /api/prefs/notifications
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("user_id", type=int, required=True)
        parser.add_argument("email_enabled", type=bool, required=True)
        parser.add_argument("push_enabled", type=bool, required=True)
        parser.add_argument("sms_enabled", type=bool, default=False)
        parser.add_argument("frequency", default="immediate")
        args = parser.parse_args()
        
        try:
            set_user_notification_preferences(
                args["user_id"], 
                args["email_enabled"], 
                args["push_enabled"],
                args["sms_enabled"],
                args["frequency"]
            )
            return {"message": "Notification preferences saved"}, 200
        except ValueError as ve:
            return {"error": str(ve)}, 400
        except Exception as e:
            return {"error": str(e)}, 500
