from flask_restful import Resource, reqparse
from models import get_all_tips, get_viewed_tips_by_parent, mark_tip_viewed

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