from flask import Flask, jsonify
from flask_restful import Api
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity, get_jwt
)


from dotenv import load_dotenv
import os

load_dotenv()



from resources.auth import RegisterAPI, LoginAPI
from resources.modules import ModuleListAPI, UploadModuleAPI, DeleteModuleAPI
from resources.quiz import QuizAPI, QuizSubmitAPI, QuizCreateAPI, DeleteQuizAPI
from resources.doubts import AskDoubtAPI, MentorDoubtAPI, ReplyToDoubtAPI, DeleteDoubtAPI
from resources.notifications import NotificationAPI
from resources.attempts import StudentAttemptsAPI
from resources.reports import StudentReportAPI, DeleteReportAPI
from resources.tips import TipListAPI, ParentViewedTipsAPI, MarkTipViewedAPI, DeleteTipAPI
from resources.complaints import (
    FileComplaintAPI, ComplaintListAPI, ResolveComplaintAPI, DeleteComplaintAPI
)
from resources.admin import (
    UserListAPI, TrainerApprovalAPI, ContentApprovalAPI,
    DownloadUserReportAPI, DownloadSummaryAPI,
    BlockUserAPI, UnblockUserAPI
)
from resources.alerts import AlertPostAPI, DeleteAlertAPI
from resources.profile import ProfileAPI, EditProfileAPI
from resources.activity import StudentActivityAPI

app = Flask(__name__)
api = Api(app)

# JWT Setup
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)



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
api.add_resource(DeleteModuleAPI, '/api/modules/delete/<int:module_id>')

# Quizzes
api.add_resource(QuizAPI, '/api/quiz/<int:quiz_id>')
api.add_resource(QuizSubmitAPI, '/api/quiz/submit')
api.add_resource(QuizCreateAPI, '/api/quiz/create')
api.add_resource(DeleteQuizAPI, '/api/quiz/delete/<int:quiz_id>')

# Doubts
api.add_resource(AskDoubtAPI, '/api/doubt')
api.add_resource(MentorDoubtAPI, '/api/doubts/<int:mentor_id>')
api.add_resource(ReplyToDoubtAPI, '/api/doubt/reply')
api.add_resource(DeleteDoubtAPI, '/api/doubt/delete/<int:doubt_id>')

# Notifications
api.add_resource(NotificationAPI, '/api/notifications/<int:user_id>')

# Attempts
api.add_resource(StudentAttemptsAPI, '/api/student/<int:student_id>/attempts')

# Reports
api.add_resource(StudentReportAPI, '/api/reports/<int:student_id>')
api.add_resource(DeleteReportAPI, '/api/reports/delete/<int:report_id>')

# Tips
api.add_resource(TipListAPI, '/api/tips')
api.add_resource(ParentViewedTipsAPI, '/api/tips/viewed/<int:parent_id>')
api.add_resource(MarkTipViewedAPI, '/api/tips/viewed')
api.add_resource(DeleteTipAPI, '/api/tips/delete/<int:tip_id>')

# Complaints
api.add_resource(FileComplaintAPI, '/api/complaints/file')
api.add_resource(ComplaintListAPI, '/api/complaints')
api.add_resource(ResolveComplaintAPI, '/api/complaints/resolve')
api.add_resource(DeleteComplaintAPI, '/api/complaints/delete/<int:complaint_id>')

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
api.add_resource(DeleteAlertAPI, '/api/alerts/delete/<int:alert_id>')

# Profile
api.add_resource(ProfileAPI, '/api/profile/<int:user_id>')
api.add_resource(EditProfileAPI, '/api/profile/edit')

# Activity
api.add_resource(StudentActivityAPI, '/api/activity/<int:student_id>')

if __name__ == '__main__':
    app.run(debug=True, port=5050)









'''from flask import Flask
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
from resources.modules import DeleteModuleAPI
from resources.quiz import DeleteQuizAPI
from resources.doubts import DeleteDoubtAPI
from resources.complaints import DeleteComplaintAPI
from resources.tips import DeleteTipAPI
from resources.reports import DeleteReportAPI
from resources.alerts import DeleteAlertAPI



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

api.add_resource(DeleteModuleAPI, '/api/modules/delete/<int:module_id>')
api.add_resource(DeleteQuizAPI, '/api/quiz/delete/<int:quiz_id>')
api.add_resource(DeleteDoubtAPI, '/api/doubt/delete/<int:doubt_id>')
api.add_resource(DeleteComplaintAPI, '/api/complaints/delete/<int:complaint_id>')
api.add_resource(DeleteTipAPI, '/api/tips/delete/<int:tip_id>')
api.add_resource(DeleteReportAPI, '/api/reports/delete/<int:report_id>')
api.add_resource(DeleteAlertAPI, '/api/alerts/delete/<int:alert_id>')


if __name__ == '__main__':
    app.run(debug=True, port=5050)
'''