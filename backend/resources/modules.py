from flask_restful import Resource
from models import get_all_modules

class ModuleListAPI(Resource):
    def get(self):
        modules = get_all_modules()
        return [dict(m) for m in modules]