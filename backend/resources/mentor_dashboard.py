from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from utils.auth_utils import role_required

from models import (
    get_mentor_video_status,
    #get_mentor_quiz_status,
    get_mentor_doubt_status,

)

class VideoStatusAPI(Resource):
    @jwt_required()
    @role_required('mentor')
    def get(self,user_id):
        """Get all users (Admin only)"""
        return [dict(u) for u in get_mentor_video_status(user_id)]


#class QuizStatusAPI(Resource):
#    @jwt_required()
#    @role_required('admin')
#    def get(self,user_id):
#        """Get all users (Admin only)"""
#        return [dict(u) for u in get_mentor_quiz_status()]
    
class DoubtStatusAPI(Resource):
    @jwt_required()
    @role_required('mentor')
    def get(self,user_id):
        """Get all users (Admin only)"""
        return [dict(u) for u in get_mentor_doubt_status(user_id)]