from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models import get_user_theme, set_user_theme

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
