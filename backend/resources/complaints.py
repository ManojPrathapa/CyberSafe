from flask_restful import Resource, reqparse
from models import file_complaint, get_complaints, resolve_complaint

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