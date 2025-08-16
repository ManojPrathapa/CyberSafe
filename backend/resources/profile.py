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

from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models import get_profile_details, update_profile_details,update_mentor_profile_details

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
        parser.add_argument('user_id', required=True, type=int)
        parser.add_argument('email', required=False)
        parser.add_argument('username', required=False)
        parser.add_argument('password', required=False)
        args = parser.parse_args()

        try:
            update_profile_details(args)
            return {"message": "Profile updated successfully"}, 200

        except ValueError as ve:  
            # Validation issues (user not found, duplicate email, duplicate username)
            return {"error": str(ve)}, 400  

        except Exception as e:
            # Unexpected server issues
            return {"error": str(e)}, 500
        
class EditProfileAPI_Mentor(Resource):
    @jwt_required()
    def post(self):
        """Edit a user's profile (JWT required)"""
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', required=True, type=int)
        parser.add_argument('email', required=False)
        parser.add_argument('username', required=False)
        #parser.add_argument('password', required=False)
        parser.add_argument('expertise',required=False)
        parser.add_argument('experience_years',required=False)
        args = parser.parse_args()

        try:
            update_mentor_profile_details(args)
            return {"message": "Profile updated successfully"}, 200

        except ValueError as ve:  
            # Validation issues (user not found, duplicate email, duplicate username)
            return {"error": str(ve)}, 400  

        except Exception as e:
            # Unexpected server issues
            return {"error": str(e)}, 500
