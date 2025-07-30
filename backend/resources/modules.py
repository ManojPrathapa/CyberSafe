from flask_restful import Resource, reqparse
from flask import request
from models import upload_module_content
from flask_restful import Resource
from models import soft_delete_module  
from models import upload_module_content, soft_delete_module, get_all_modules 
from utils.auth_utils import role_required, roles_required


class DeleteModuleAPI(Resource):
    def delete(self, module_id):
        result = soft_delete_module(module_id)
        if result:
            return {'message': f'Module {module_id} deleted successfully'}, 200
        return {'message': f'Module {module_id} not found or already deleted'}, 404

class ModuleListAPI(Resource):
    def get(self):
        modules = get_all_modules()
        return [dict(m) for m in modules]
    
class UploadModuleAPI(Resource):
    
    def post(self):
        data = request.get_json()
        mentor_id = data.get('mentor_id')
        title = data.get('title')
        description = data.get('description')
        video_url = data.get('video_url')
        resource_link = data.get('resource_link')

        upload_module_content(mentor_id, title, description, video_url, resource_link)
        return {'message': 'Module uploaded successfully'}
       
