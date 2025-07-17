from flask_restful import Resource, reqparse
from models import get_all_tips, get_viewed_tips_by_parent, mark_tip_viewed
from flask_restful import Resource
from models import soft_delete_tip  # Ensure this is defined in models.py

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
        return {'message': 'Tip marked as viewed'}, 201