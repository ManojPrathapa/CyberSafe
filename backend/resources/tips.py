'''from flask_restful import Resource, reqparse
from models import get_all_tips, get_viewed_tips_by_parent, mark_tip_viewed
from flask_restful import Resource
from models import soft_delete_tip  

class DeleteTipAPI(Resource):
    def delete(self, tip_id):
        result = soft_delete_tip(tip_id)
        if result:
            return {'message': f'Tip {tip_id} deleted successfully'}, 200
        return {'message': f'Tip {tip_id} not found or already deleted'}, 404


class TipListAPI(Resource):
    def get(self):
        return [dict(t) for t in get_all_tips()]

class ParentViewedTipsAPI(Resource):
    def get(self, parent_id):
        return [dict(t) for t in get_viewed_tips_by_parent(parent_id)]

class MarkTipViewedAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('parent_id', required=True, type=int)
        parser.add_argument('tip_id', required=True, type=int)
        args = parser.parse_args()
        mark_tip_viewed(args['parent_id'], args['tip_id'])
        return {'message': 'Tip marked as viewed'}, 201'''

from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required

from models import (
    get_all_tips,
    get_viewed_tips_by_parent,
    mark_tip_viewed,
    soft_delete_tip
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


class ParentViewedTipsAPI(Resource):
    @jwt_required()
    def get(self, parent_id):
        """Get all tips viewed by a specific parent (JWT required)"""
        try:
            return [dict(t) for t in get_viewed_tips_by_parent(parent_id)], 200
        except ValueError as e:
            return {'error': str(e)}, 404
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
