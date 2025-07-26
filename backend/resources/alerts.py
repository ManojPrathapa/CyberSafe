from flask_restful import Resource, reqparse
from models import post_alert
from flask_restful import Resource
from models import soft_delete_alert  

class DeleteAlertAPI(Resource):
    def delete(self, alert_id):
        result = soft_delete_alert(alert_id)
        if result:
            return {'message': f'Alert {alert_id} deleted successfully'}, 200
        return {'message': f'Alert {alert_id} not found or already deleted'}, 404


class AlertPostAPI(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('message', required=True)
        args = parser.parse_args()
        post_alert(args['message'])
        return {'message': 'Alert sent successfully'}