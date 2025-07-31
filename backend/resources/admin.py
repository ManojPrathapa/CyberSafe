'''from flask_restful import Resource, reqparse
from models import download_user_report, download_summary
from utils.auth_utils import role_required, roles_required


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
        return {'message': 'User unblocked'}'''

from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from utils.auth_utils import role_required

from models import (
    get_all_users,
    get_pending_trainers,
    get_pending_contents,
    download_user_report,
    download_summary,
    block_user,
    unblock_user
)

class UserListAPI(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        """Get all users (Admin only)"""
        return [dict(u) for u in get_all_users()]


class TrainerApprovalAPI(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        """Get pending trainer approvals (Admin only)"""
        return [dict(t) for t in get_pending_trainers()]


class ContentApprovalAPI(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        """Get pending content approvals (Admin only)"""
        return [dict(c) for c in get_pending_contents()]


class DownloadUserReportAPI(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        """Download user report (Admin only)"""
        return download_user_report()


class DownloadSummaryAPI(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        """Download summary report (Admin only)"""
        return download_summary()


class BlockUserAPI(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self):
        """Block a user (Admin only)"""
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', required=True)
        args = parser.parse_args()
        block_user(args['user_id'])
        return {'message': 'User blocked'}


class UnblockUserAPI(Resource):
    @jwt_required()
    @role_required('admin')
    def post(self):
        """Unblock a user (Admin only)"""
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', required=True)
        args = parser.parse_args()
        unblock_user(args['user_id'])
        return {'message': 'User unblocked'}
