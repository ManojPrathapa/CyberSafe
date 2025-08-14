from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models import (
    create_video, get_all_videos, get_video_by_id,
    update_video, block_video, unblock_video, delete_video,
    increment_video_views, increment_video_likes
)

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
        args = video_parser.parse_args()
        create_video(
            args['title'],
            args.get('description', ''),
            args['uploaded_by'],
            args['mentor_id'],
            args['module_id']
        )
        return {"message": "Video created successfully"}, 201


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
