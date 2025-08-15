'''from flask_restful import Resource, reqparse
from models import file_complaint, get_complaints, resolve_complaint
from flask_restful import Resource
from models import soft_delete_complaint  

class DeleteComplaintAPI(Resource):
    def delete(self, complaint_id):
        result = soft_delete_complaint(complaint_id)
        if result:
            return {'message': f'Complaint {complaint_id} deleted successfully'}, 200
        return {'message': f'Complaint {complaint_id} not found or already deleted'}, 404


class FileComplaintAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('filed_by', required=True)
        parser.add_argument('against', required=True)
        parser.add_argument('description', required=True)
        args = parser.parse_args()
        file_complaint(args['filed_by'], args['against'], args['description'])
        return {'message': 'Complaint filed'}, 201

class ComplaintListAPI(Resource):
    def get(self):
        return [dict(c) for c in get_complaints()]

class ResolveComplaintAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('complaint_id', required=True, type=int)
        args = parser.parse_args()
        resolve_complaint(args['complaint_id'])
        return {'message': 'Complaint resolved'}
    
    '''

'''from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models import (
    file_complaint,
    get_complaints,
    resolve_complaint,
    soft_delete_complaint
)


class DeleteComplaintAPI(Resource):
    @jwt_required()
    def delete(self, complaint_id):
        """Soft delete a complaint"""
        result = soft_delete_complaint(complaint_id)
        if result:
            return {'message': f'Complaint {complaint_id} deleted successfully'}, 200
        return {'message': f'Complaint {complaint_id} not found or already deleted'}, 404


class FileComplaintAPI(Resource):
    @jwt_required()
    def post(self):
        """File a new complaint"""
        parser = reqparse.RequestParser()
        parser.add_argument('filed_by', required=True)
        parser.add_argument('against', required=True)
        parser.add_argument('description', required=True)
        args = parser.parse_args()

        file_complaint(args['filed_by'], args['against'], args['description'])
        return {'message': 'Complaint filed'}, 201


class ComplaintListAPI(Resource):
    @jwt_required()
    def get(self):
        """Get all complaints"""
        return [dict(c) for c in get_complaints()]


class ResolveComplaintAPI(Resource):
    @jwt_required()
    def post(self):
        """Mark complaint as resolved"""
        parser = reqparse.RequestParser()
        parser.add_argument('complaint_id', required=True, type=int)
        args = parser.parse_args()

        resolve_complaint(args['complaint_id'])
        return {'message': 'Complaint resolved'}
'''
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from models import (
    file_complaint,
    get_complaints,
    resolve_complaint,
    soft_delete_complaint
)
from helpers.notifications_helper import send_notification


class DeleteComplaintAPI(Resource):
    @jwt_required()
    def delete(self, complaint_id):
        """Soft delete a complaint"""
        result = soft_delete_complaint(complaint_id)
        if result:
            return {'message': f'Complaint {complaint_id} deleted successfully'}, 200
        return {'message': f'Complaint {complaint_id} not found or already deleted'}, 404


class FileComplaintAPI(Resource):
    @jwt_required()
    def post(self):
        """File a new complaint"""
        parser = reqparse.RequestParser()
        parser.add_argument('filed_by', required=True, type=int)
        parser.add_argument('against', required=True, type=int)
        parser.add_argument('description', required=True)
        args = parser.parse_args()

        # Insert complaint and get complaint_id
        complaint_id = file_complaint(args['filed_by'], args['against'], args['description'])

        # Trigger notification for the user who filed the complaint
        send_notification(
            event_type="complaint_filed",
            related_id=complaint_id,
            user_id=args['filed_by'],
            message="Your complaint has been filed successfully."
        )

        return {'message': 'Complaint filed'}, 201


class ComplaintListAPI(Resource):
    @jwt_required()
    def get(self):
        """Get all complaints"""
        return [dict(c) for c in get_complaints()]


class ResolveComplaintAPI(Resource):
    @jwt_required()
    def post(self):
        """Mark complaint as resolved"""
        parser = reqparse.RequestParser()
        parser.add_argument('complaint_id', required=True, type=int)
        parser.add_argument('filed_by', required=True, type=int)  # Needed for notification
        args = parser.parse_args()

        resolve_complaint(args['complaint_id'])

        # Trigger notification for the user who filed the complaint
        send_notification(
            event_type="complaint_resolved",
            related_id=args['complaint_id'],
            user_id=args['filed_by'],
            message="Your complaint has been resolved."
        )

        return {'message': 'Complaint resolved'}