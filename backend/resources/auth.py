from flask_restful import Resource, reqparse
from models import create_user, get_user_by_username

register_parser = reqparse.RequestParser()
register_parser.add_argument('username', required=True)
register_parser.add_argument('email', required=True)
register_parser.add_argument('password', required=True)
register_parser.add_argument('role', required=True)

login_parser = reqparse.RequestParser()
login_parser.add_argument('username', required=True)
login_parser.add_argument('password', required=True)

class RegisterAPI(Resource):
    def post(self):
        args = register_parser.parse_args()
        if get_user_by_username(args['username']):
            return {'error': 'Username already exists'}, 400
        create_user(args['username'], args['email'], args['password'], args['role'])
        return {'message': 'User registered successfully'}, 201
    
    

class LoginAPI(Resource):
    def post(self):
        args = login_parser.parse_args()
        user = get_user_by_username(args['username'])
        if user and user['password'] == args['password']:
            return {
                'message': 'Login successful',
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'role': user['role']
                }
            }
        return {'error': 'Invalid credentials'}, 401