from flask import Flask
from flask_restful import Api
from resources.auth import RegisterAPI, LoginAPI
from resources.modules import ModuleListAPI, UploadModuleAPI
from resources.quiz import QuizAPI, QuizSubmitAPI, QuizCreateAPI
from resources.doubts import AskDoubtAPI, MentorDoubtAPI, ReplyToDoubtAPI
from resources.notifications import NotificationAPI
from resources.attempts import StudentAttemptsAPI
from resources.reports import StudentReportAPI
from resources.tips import TipListAPI, ParentViewedTipsAPI, MarkTipViewedAPI
from resources.complaints import FileComplaintAPI, ComplaintListAPI, ResolveComplaintAPI
from resources.admin import (
    UserListAPI, TrainerApprovalAPI, ContentApprovalAPI,
    DownloadUserReportAPI, DownloadSummaryAPI,
    BlockUserAPI, UnblockUserAPI
)
from resources.alerts import AlertPostAPI
from resources.profile import ProfileAPI, EditProfileAPI
from resources.activity import StudentActivityAPI

app = Flask(__name__)
api = Api(app)

# Root routes
@app.route('/')
def index():
    return {'message': 'CYBERSAFE API is running! Visit /api/* routes.'}

@app.route('/api')
def api_index():
    return {'message': 'CYBERSAFE API is running! Visit /api/* routes.'}

# Authentication
api.add_resource(RegisterAPI, '/api/register')
api.add_resource(LoginAPI, '/api/login')

# Modules
api.add_resource(ModuleListAPI, '/api/modules')
api.add_resource(UploadModuleAPI, '/api/modules/upload')

# Quizzes
api.add_resource(QuizAPI, '/api/quiz/<int:quiz_id>')
api.add_resource(QuizSubmitAPI, '/api/quiz/submit')
api.add_resource(QuizCreateAPI, '/api/quiz/create')

# Doubts
api.add_resource(AskDoubtAPI, '/api/doubt')
api.add_resource(MentorDoubtAPI, '/api/doubts/<int:mentor_id>')
api.add_resource(ReplyToDoubtAPI, '/api/doubt/reply')

# Notifications
api.add_resource(NotificationAPI, '/api/notifications/<int:user_id>')

# Attempts
api.add_resource(StudentAttemptsAPI, '/api/student/<int:student_id>/attempts')

# Reports
api.add_resource(StudentReportAPI, '/api/reports/<int:student_id>')

# Tips
api.add_resource(TipListAPI, '/api/tips')
api.add_resource(ParentViewedTipsAPI, '/api/tips/viewed/<int:parent_id>')
api.add_resource(MarkTipViewedAPI, '/api/tips/viewed')

# Complaints
api.add_resource(FileComplaintAPI, '/api/complaints/file')
api.add_resource(ComplaintListAPI, '/api/complaints')
api.add_resource(ResolveComplaintAPI, '/api/complaints/resolve')

# Admin Panel
api.add_resource(UserListAPI, '/api/admin/users')
api.add_resource(TrainerApprovalAPI, '/api/admin/trainers/pending')
api.add_resource(ContentApprovalAPI, '/api/admin/contents/pending')
api.add_resource(DownloadUserReportAPI, '/api/admin/reports/download/users')
api.add_resource(DownloadSummaryAPI, '/api/admin/reports/download/summary')
api.add_resource(BlockUserAPI, '/api/admin/block')
api.add_resource(UnblockUserAPI, '/api/admin/unblock')

# Alerts
api.add_resource(AlertPostAPI, '/api/alerts/post')

# Profile
api.add_resource(ProfileAPI, '/api/profile/<int:user_id>')
api.add_resource(EditProfileAPI, '/api/profile/edit')

# Activity
api.add_resource(StudentActivityAPI, '/api/activity/<int:student_id>')

if __name__ == '__main__':
    app.run(debug=True, port=5050)
