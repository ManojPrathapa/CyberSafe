from flask_restful import Resource, reqparse
from models import download_user_report, download_summary

from models import (
    get_all_users, get_pending_trainers, get_pending_contents,
    download_user_report, download_summary, block_user, unblock_user
)

class UserListAPI(Resource):
    def get(self):
        return [dict(u) for u in get_all_users()]

class TrainerApprovalAPI(Resource):
    def get(self):
        return [dict(t) for t in get_pending_trainers()]

class ContentApprovalAPI(Resource):
    def get(self):
        return [dict(c) for c in get_pending_contents()]

class DownloadUserReportAPI(Resource):
    def get(self):
        return download_user_report()

class DownloadSummaryAPI(Resource):
    def get(self):
        return download_summary()

class BlockUserAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', required=True)
        args = parser.parse_args()
        block_user(args['user_id'])
        return {'message': 'User blocked'}

class UnblockUserAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', required=True)
        args = parser.parse_args()
        unblock_user(args['user_id'])
        return {'message': 'User unblocked'}