import os
import datetime
from flask import request
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from utils.auth_utils import role_required
from models import (
    create_video, get_all_videos, get_video_by_id,
    update_video, block_video, unblock_video, delete_video,
    increment_video_views, increment_video_likes,get_mentor_videos,approve_video
)
UPLOAD_FOLDER = os.path.join(os.getcwd(), "static", "videos")
os.makedirs(UPLOAD_FOLDER, exist_ok=True) 

print(UPLOAD_FOLDER)

# Parser for video creation & update
video_parser = reqparse.RequestParser()
video_parser.add_argument('title', type=str, required=True, help="Title is required")
video_parser.add_argument('description', type=str, required=False)
video_parser.add_argument('uploaded_by', type=int, required=True)
video_parser.add_argument('mentor_id', type=int, required=True)
video_parser.add_argument('module_id', type=int, required=True)

class VideoListAPI(Resource):
    @jwt_required()
    def get(self):
        """Get all active videos"""
        return [dict(v) for v in get_all_videos()]

    @jwt_required()
    def post(self):
        """Add a new video"""
        print("PATH_NAME:",UPLOAD_FOLDER)
        #args = video_parser.parse_args()
        #create_video(
        #    args['title'],
        #    args.get('description', ''),
        #    args['uploaded_by'],
        #    args['mentor_id'],
        #    args['module_id']
        #)
        title=request.form.get("title")
        description = request.form.get("description")
        uploaded_by = request.form.get("uploaded_by")
        mentor_id = request.form.get("mentor_id")
        module_id = request.form.get("module_id")  
        video_file = request.files.get("video")
        if not video_file:
            return {"error": "No video file uploaded"}, 400
        
        filename = f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}_{video_file.filename}"
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        video_file.save(save_path)
        video_url = f"/static/videos/{filename}"
        create_video(
            title,
            description,
            uploaded_by,
            mentor_id,
            module_id,
            video_url
        )
        print("Request content type:", request.content_type)
        print("Form data:", request.form)
        print("Files:", request.files)
        return {"message": "Video uploaded successfully"}, 201

class PendingVideosAPI(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        """Get all videos waiting for approval"""
        from models import get_pending_videos
        return get_pending_videos(), 200


class ApproveVideoAPI(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self, video_id):
        """Approve a video by ID"""
        updated = approve_video(video_id)  
        if updated:
            return {"message": f"Video {video_id} approved successfully"}, 200
        return {"error": "Video not found"}, 404

class VideoAPI(Resource):
    @jwt_required()
    def get(self, video_id):
        """Get a video by ID"""
        video = get_video_by_id(video_id)
        if not video:
            return {"error": "Video not found"}, 404
        return dict(video)

    @jwt_required()
    def put(self, video_id):
        """Update video"""
        args = video_parser.parse_args()
        update_video(
            video_id,
            args.get('title'),
            args.get('description', ''),
            args.get('module_id')
        )
        return {"message": "Video updated successfully"}

    @jwt_required()
    def delete(self, video_id):
        """Delete video (hard delete)"""
        delete_video(video_id)
        return {"message": "Video deleted successfully"}


class VideoBlockAPI(Resource):
    @jwt_required()
    def put(self, video_id):
        """Block a video (soft delete)"""
        block_video(video_id)
        return {"message": "Video blocked successfully"}


class VideoUnblockAPI(Resource):
    @jwt_required()
    def put(self, video_id):
        """Unblock a video"""
        unblock_video(video_id)
        return {"message": "Video unblocked successfully"}


class VideoViewAPI(Resource):
    @jwt_required()
    def put(self, video_id):
        """Increment video views"""
        increment_video_views(video_id)
        return {"message": "Video view count updated"}


class VideoLikeAPI(Resource):
    @jwt_required()
    def put(self, video_id):
        """Increment video likes"""
        increment_video_likes(video_id)
        return {"message": "Video like count updated"}
    
    
class Mentor_VideoListAPI(Resource):
    @jwt_required()
    def get(self,user_id):
        """Get all active videos"""
        #return [dict(v) for v in get_mentor_videos(user_id)]
        return get_mentor_videos(user_id)