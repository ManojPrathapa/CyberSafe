from flask_restful import Resource, reqparse
from models import get_profile_details, update_profile_details

class ProfileAPI(Resource):
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
        return {"message": "Profile updated successfully"}


# 📁 resources/activity.py
from flask_restful import Resource
from models import get_student_activity

class StudentActivityAPI(Resource):
    def get(self, student_id):
        return get_student_activity(student_id)