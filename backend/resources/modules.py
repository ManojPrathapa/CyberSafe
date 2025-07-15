from flask_restful import Resource, reqparse
from flask import request
from models import upload_module_content

class ModuleListAPI(Resource):
    def get(self):
        from models import get_all_modules
        modules = get_all_modules()
        return [dict(m) for m in modules]

class UploadModuleAPI(Resource):
    def post(self):
        data = request.get_json()
        mentor_id = data.get('mentor_id')
        title = data.get('title')
        description = data.get('description')
        upload_module_content(mentor_id, title, description)
        return {'message': 'Module uploaded successfully'}