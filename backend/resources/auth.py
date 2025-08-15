from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import create_user, get_user_by_username,  update_user_password
from utils.auth_utils import role_required, roles_required
import sqlite3


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
        
        if not args['role'] in ['student', 'parent', 'mentor','admin','support']:
            return {'error': 'Invalid role'}, 400

        # Hash password before storing
        hashed_password = generate_password_hash(args['password'])

        try:
            create_user(args['username'], args['email'], hashed_password, args['role'])
            return {'message': 'User registered successfully'}, 201
        except sqlite3.IntegrityError as e:
            if 'UNIQUE constraint failed: users.email' in str(e):
                return {'error': 'Email already exists'}, 400
            elif 'UNIQUE constraint failed: users.username' in str(e):
                return {'error': 'Username already exists'}, 400
            else:
                return {'error': 'Registration failed due to database constraint'}, 400
        except Exception as e:
            return {'error': f'Registration failed: {str(e)}'}, 500


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


class UpdatePasswordAPI(Resource):
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()

        parser.add_argument('old_password', required=True)
        parser.add_argument('new_password', required=True)
        args = parser.parse_args()

        user_id = get_jwt_identity()
        success, message = update_user_password(user_id, args['old_password'], args['new_password'])

        status_code = 200 if success else 400
        return {"message": message}, status_code

