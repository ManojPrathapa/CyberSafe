from flask_restful import Resource, reqparse
from models import get_profile_details, update_profile_details

'''class ProfileAPI(Resource):
    def get(self, user_id):
        return get_profile_details(user_id)

class EditProfileAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', required=True)
        parser.add_argument('email', required=False)
        parser.add_argument('username', required=False)
        parser.add_argument('password', required=False)
        args = parser.parse_args()
        update_profile_details(args)
        return {"message": "Profile updated successfully"}'''

class ProfileAPI(Resource):
    def get(self, user_id):
        try:
            return get_profile_details(user_id), 200
        except Exception as e:
            return {"error": str(e)}, 500

class EditProfileAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', required=True)
        parser.add_argument('email', required=False)
        parser.add_argument('username', required=False)
        parser.add_argument('password', required=False)
        args = parser.parse_args()
        try:
            update_profile_details(args)
            return {"message": "Profile updated successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500



