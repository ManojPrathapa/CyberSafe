from flask_restful import Resource
from models import get_mentor_for_module

class ModuleMentorAPI(Resource):
    def get(self, module_id):
        mentor = get_mentor_for_module(module_id)
        if not mentor:
            return {"message": "No mentor found for this module and no fallback mentors available"}, 404
        return dict(mentor), 200