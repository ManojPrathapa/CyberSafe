from flask import Flask
from flask_restful import Api
from resources.auth import RegisterAPI, LoginAPI
from resources.modules import ModuleListAPI
from resources.quiz import QuizAPI, QuizSubmitAPI
from resources.doubts import AskDoubtAPI, MentorDoubtAPI
from resources.notifications import NotificationAPI
from resources.attempts import StudentAttemptsAPI
from resources.reports import StudentReportAPI
from resources.tips import TipListAPI, ParentViewedTipsAPI, MarkTipViewedAPI
from resources.complaints import FileComplaintAPI, ComplaintListAPI, ResolveComplaintAPI

app = Flask(__name__)
api = Api(app)

# Routes
@app.route('/')
def index():
    return {'message': 'CYBERSAFE API is running! Visit /api/* routes.'}
@app.route('/api')
def api_index():
    return {'message': 'CYBERSAFE API is running! Visit /api/* routes.'}



api.add_resource(RegisterAPI, '/api/register')
api.add_resource(LoginAPI, '/api/login')
api.add_resource(ModuleListAPI, '/api/modules')
api.add_resource(QuizAPI, '/api/quiz/<int:quiz_id>')
api.add_resource(QuizSubmitAPI, '/api/quiz/submit')
api.add_resource(AskDoubtAPI, '/api/doubt')
api.add_resource(MentorDoubtAPI, '/api/doubts/<int:mentor_id>')
api.add_resource(NotificationAPI, '/api/notifications/<int:user_id>')
api.add_resource(StudentAttemptsAPI, '/api/student/<int:student_id>/attempts')
api.add_resource(StudentReportAPI, '/api/reports/<int:student_id>')
api.add_resource(TipListAPI, '/api/tips')
api.add_resource(ParentViewedTipsAPI, '/api/tips/viewed/<int:parent_id>')
api.add_resource(MarkTipViewedAPI, '/api/tips/viewed')
api.add_resource(FileComplaintAPI, '/api/complaints/file')
api.add_resource(ComplaintListAPI, '/api/complaints')
api.add_resource(ResolveComplaintAPI, '/api/complaints/resolve')

if __name__ == '__main__':
    app.run(debug=True)
