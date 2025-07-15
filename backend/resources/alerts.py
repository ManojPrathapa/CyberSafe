from flask_restful import Resource, reqparse
from models import post_alert

class AlertPostAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('message', required=True)
        args = parser.parse_args()
        post_alert(args['message'])
        return {'message': 'Alert sent successfully'}