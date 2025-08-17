
        
from flask_restful import Resource, reqparse
from models import post_alert, soft_delete_alert
from helpers.notifications_helper import send_notification
from werkzeug.exceptions import BadRequest
from flask_jwt_extended import jwt_required

class AlertPostAPI(Resource):
    @jwt_required()
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('message', required=True)
            args = parser.parse_args()

            
            alert_id = post_alert(args['message'])  
            
            send_notification(
                event_type="alert",
                related_id=alert_id,
                message=args['message']
            )

            return {'message': 'Alert sent successfully'}, 200

        except BadRequest:
            return {"message": "Missing required field: message"}, 400
        except Exception as e:
            return {"error": str(e)}, 500


class DeleteAlertAPI(Resource):
    @jwt_required()
    def delete(self, alert_id):
        try:
            result = soft_delete_alert(alert_id)
            if result:
                return {'message': f'Alert {alert_id} deleted successfully'}, 200
            return {'message': f'Alert {alert_id} not found or already deleted'}, 404
        except Exception as e:
            return {'error': str(e)}, 500