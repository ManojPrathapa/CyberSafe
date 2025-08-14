'''from flask_restful import Resource, reqparse
from models import get_profile_details, update_profile_details


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



'''

'''from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models import get_profile_details, update_profile_details

class ProfileAPI(Resource):
    @jwt_required()
    def get(self, user_id):
        """Fetch a user's profile (JWT required)"""
        try:
            return get_profile_details(user_id), 200
        except Exception as e:
            return {"error": str(e)}, 500


class EditProfileAPI(Resource):
    @jwt_required()
    def post(self):
        """Edit a user's profile (JWT required)"""
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
'''

from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import get_profile_details, update_profile_details, get_user_by_id

class ProfileAPI(Resource):
    @jwt_required()
    def get(self, user_id):
        """Fetch a user's profile (JWT required)"""
        try:
            return get_profile_details(user_id), 200
        except Exception as e:
            return {"error": str(e)}, 500


class EditProfileAPI(Resource):
    @jwt_required()
    def post(self):
        """Edit a mentor's profile (JWT required)"""
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=False)
        parser.add_argument('username', required=False)
        parser.add_argument('password', required=False)
        args = parser.parse_args()

        user_id = get_jwt_identity()  # Logged-in user ID
        user = get_user_by_id(user_id)

        if user.role != 'mentor':
            return {"error": "Only mentors can update their profile"}, 403

        # Prepare update data: only send fields provided
        update_data = {k: v for k, v in args.items() if v is not None}
        update_data['user_id'] = user_id

        try:
            update_profile_details(update_data)
            return {"message": "Profile updated successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500
