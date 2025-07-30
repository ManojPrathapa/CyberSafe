from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from models import create_user, get_user_by_username
from utils.auth_utils import role_required, roles_required


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

        # Hash password before storing
        hashed_password = generate_password_hash(args['password'])

        create_user(args['username'], args['email'], hashed_password, args['role'])
        return {'message': 'User registered successfully'}, 201


class LoginAPI(Resource):
    def post(self):
        args = login_parser.parse_args()
        user = get_user_by_username(args['username'])

        if user and check_password_hash(user['password'], args['password']):
            access_token = create_access_token(
                identity=str(user['id']),
                additional_claims={"username": user['username'],
                                   "role": user['role'] }
            )

            return {
                'message': 'Login successful',
                'access_token': access_token,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'role': user['role']
                }
            }
        return {'error': 'Invalid credentials'}, 401




'''from flask_restful import Resource, reqparse
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
        return {'error': 'Invalid credentials'}, 401'''