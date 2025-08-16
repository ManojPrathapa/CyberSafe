# resources/parents.py
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from models import (
    get_children_for_parent,
    link_child_to_parent,
    unlink_child_from_parent,
    get_available_students_for_parent,
)

def _can_act_on_parent(target_parent_id: int) -> tuple[bool, int, str]:
    """Return (allowed, identity, role) for convenience."""
    identity_str = get_jwt_identity()
    identity = int(identity_str) if identity_str is not None else None
    claims = get_jwt() or {}
    role = claims.get("role")
    allowed = (identity == target_parent_id) or (role in ("admin", "support"))
    return allowed, identity, role


class ParentChildrenAPI(Resource):
    @jwt_required()
    def get(self, parent_id: int):
        try:
            allowed, identity, role = _can_act_on_parent(parent_id)
            if not allowed:
                return {"error": "Forbidden for this user."}, 403

            children = get_children_for_parent(parent_id)  # may raise ValueError
            return children, 200

        except ValueError as e:
            # e.g. "User X must be a parent" or "User not found"
            return {"error": str(e)}, 400
        except Exception as e:
            # Log server-side so you can see the real trace
            print("ParentChildrenAPI GET error:", e)
            return {"error": "Failed to fetch children."}, 500


class LinkChildAPI(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("parent_id", type=int, required=True, help="parent_id is required")
    parser.add_argument("student_id", type=int, required=True, help="student_id is required")

    @jwt_required()
    def post(self):
        try:
            args = self.parser.parse_args()
            parent_id = args["parent_id"]
            student_id = args["student_id"]

            allowed, identity, role = _can_act_on_parent(parent_id)
            if not allowed:
                return {"error": "Forbidden for this user."}, 403

            inserted = link_child_to_parent(parent_id, student_id)  # may raise ValueError
            return {"linked": bool(inserted)}, 200

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            print("LinkChildAPI POST error:", e)
            return {"error": "Failed to link child."}, 500


class UnlinkChildAPI(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("parent_id", type=int, required=True)
    parser.add_argument("student_id", type=int, required=True)

    @jwt_required()
    def post(self):
        try:
            args = self.parser.parse_args()
            parent_id = args["parent_id"]
            student_id = args["student_id"]

            allowed, identity, role = _can_act_on_parent(parent_id)
            if not allowed:
                return {"error": "Forbidden for this user."}, 403

            removed = unlink_child_from_parent(parent_id, student_id)
            return {"unlinked": bool(removed)}, 200

        except ValueError as e:
            return {"error": str(e)}, 400
        except Exception as e:
            print("UnlinkChildAPI POST error:", e)
            return {"error": "Failed to unlink child."}, 500


class AvailableStudentsAPI(Resource):
    @jwt_required()
    def get(self, parent_id: int):
        try:
            allowed, identity, role = _can_act_on_parent(parent_id)
            if not allowed:
                return {"error": "Forbidden for this user."}, 403

            students = get_available_students_for_parent(parent_id)  # may raise ValueError
            return students, 200

        except ValueError as e:
            # e.g. "User X must be a parent" or "User not found"
            return {"error": str(e)}, 400
        except Exception as e:
            # Log server-side so you can see the real trace
            print("AvailableStudentsAPI GET error:", e)
            return {"error": "Failed to fetch available students."}, 500
