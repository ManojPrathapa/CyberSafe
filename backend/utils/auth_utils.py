from flask_jwt_extended import jwt_required, get_jwt
from functools import wraps
from flask import jsonify


def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") != role:
                return jsonify({"error": f"{role} access only"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def roles_required(*allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") not in allowed_roles:
                return jsonify({"error": f"Access forbidden for role: {claims.get('role')}"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
