from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from flask_restful import Resource
from models import get_all_tips, get_tips_with_status

class TipsAPI(Resource):
    def get(self):
        return get_all_tips(), 200

class TipsWithStatusAPI(Resource):
    def get(self, parent_id):
        return get_tips_with_status(parent_id), 200


from models import (
    get_all_tips,
    get_viewed_tips_by_parent,
    get_all_tips_with_viewed_status,
    mark_tip_viewed,
    soft_delete_tip,
    get_mentor_tips,
    upload_mentor_tips
)

class DeleteTipAPI(Resource):
    @jwt_required()
    def delete(self, tip_id):
        """Soft delete a tip by ID (JWT required)"""
        result = soft_delete_tip(tip_id)
        if result:
            return {'message': f'Tip {tip_id} deleted successfully'}, 200
        return {'message': f'Tip {tip_id} not found or already deleted'}, 404


class TipListAPI(Resource):
    @jwt_required()
    def get(self):
        """Get all tips (JWT required)"""
        return [dict(t) for t in get_all_tips()]


class TipsWithViewedStatusAPI(Resource):
    @jwt_required()
    def get(self, parent_id):
        """Get all tips with viewed status for a specific parent (JWT required)"""
        try:
            tips = get_all_tips_with_viewed_status(parent_id)
            return tips, 200
        except Exception as e:
            return {'error': str(e)}, 500


class ParentViewedTipsAPI(Resource):
    @jwt_required()
    def get(self, parent_id):
        """Get all tips viewed by a specific parent (JWT required)"""
        try:
            tips = get_viewed_tips_by_parent(parent_id)
            return [dict(t) for t in tips], 200
        except Exception as e:
            return {'error': str(e)}, 500


class MarkTipViewedAPI(Resource):
    @jwt_required()
    def post(self):
        """Mark a tip as viewed by a parent (JWT required)"""
        parser = reqparse.RequestParser()
        parser.add_argument('parent_id', required=True, type=int)
        parser.add_argument('tip_id', required=True, type=int)
        args = parser.parse_args()
        mark_tip_viewed(args['parent_id'], args['tip_id'])
        return {'message': 'Tip marked as viewed'}, 201
    
class MentorTipListAPI(Resource):
    @jwt_required()
    def get(self,user_id):
        """Get all tips (JWT required)"""
        print("MentorTipListAPI")
        return [dict(t) for t in get_mentor_tips(user_id)]

class MentorUploadTipsAPI(Resource):
    @jwt_required()
    def post(self):
        """Mark a tip as viewed by a parent (JWT required)"""
        parser = reqparse.RequestParser()
        parser.add_argument('title', required=True, type=str)
        parser.add_argument('content', required=True, type=str)
        parser.add_argument('mentor_id', required=True, type=int)
        parser.add_argument('category', type=str)
        parser.add_argument('source_url', type=str)
        
        args = parser.parse_args()
        upload_mentor_tips(args["title"],args["content"],args["mentor_id"],args["category"],args['source_url'])
        return {'message': 'Tip uploaded successfully'}, 201