from flask import Flask, jsonify
from flask_restful import Api
from flask_jwt_extended import (
    JWTManager, jwt_required, get_jwt_identity, get_jwt
)
from flask_cors import CORS

from dotenv import load_dotenv
import os

load_dotenv()



from resources.auth import RegisterAPI, LoginAPI, UpdatePasswordAPI
from resources.modules import ModuleListAPI, UploadModuleAPI, DeleteModuleAPI, ModuleWithContentAPI
from resources.quiz import QuizAPI, QuizSubmitAPI, QuizCreateAPI, DeleteQuizAPI, ModuleQuizzesAPI
from resources.doubts import MentorDoubtAPI, ReplyToDoubtAPI, DeleteDoubtAPI #,AskDoubtAPI
from resources.notifications import NotificationAPI
from resources.mentor_dashboard import VideoStatusAPI,DoubtStatusAPI,VideoStatusAPI_2,VideoStatusAPI_3
from resources.doubts import MentorDoubtAPI, ReplyToDoubtAPI, DeleteDoubtAPI, StudentDoubtsAPI
from resources.mentor_dashboard import VideoStatusAPI,DoubtStatusAPI
from resources.attempts import StudentAttemptsAPI
from resources.reports import StudentReportAPI, DeleteReportAPI
from resources.tips import TipListAPI, ParentViewedTipsAPI, MarkTipViewedAPI, DeleteTipAPI, TipsWithViewedStatusAPI,MentorTipListAPI,MentorUploadTipsAPI
from resources.complaints import (
    FileComplaintAPI, ComplaintListAPI, ResolveComplaintAPI, DeleteComplaintAPI, UserComplaintsAPI
)
from resources.admin import (
    UserListAPI, TrainerApprovalAPI, ContentApprovalAPI,
    DownloadUserReportAPI, DownloadSummaryAPI,
    BlockUserAPI, UnblockUserAPI
)
from resources.alerts import AlertPostAPI, DeleteAlertAPI
from resources.profile import ProfileAPI, EditProfileAPI, EditProfileAPI_Mentor
from resources.activity import StudentActivityAPI, ParentChildrenActivityAPI, ParentDashboardAPI
from resources.preferences import ThemePrefsAPI, NotificationPrefsAPI
from resources.parents import ParentChildrenAPI, LinkChildAPI, UnlinkChildAPI, AvailableStudentsAPI
from resources.studentDashboard import StudentDashboardAPI
from resources.videos import Mentor_VideoListAPI,VideoListAPI
from resources.modules_and_mentors import ModuleMentorAPI

from resources.prefs import UserPreferencesAPI
from resources.notifications import NotificationsAPI, NotificationReadAPI
from resources.tips import TipsAPI, TipsWithStatusAPI
from resources.parents import ParentChildrenAPI
from resources.profile import ProfileAPI
from resources.dashboard import ParentDashboardAPI
from resources.activity import ParentChildrenActivityAPI

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

api = Api(app)

#CORS(app, resources={r"/api/*": {"origins": "*"}})


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
api.add_resource(UpdatePasswordAPI, '/api/users/update-password')


# Modules
api.add_resource(ModuleListAPI, '/api/modules')
api.add_resource(UploadModuleAPI, '/api/modules/upload')
api.add_resource(DeleteModuleAPI, '/api/modules/delete/<int:module_id>')
api.add_resource(ModuleWithContentAPI, "/api/modules_with_content")


# Quizzes
api.add_resource(QuizAPI, '/api/quiz/<int:user_id>')
api.add_resource(QuizSubmitAPI, '/api/quiz/submit')
api.add_resource(QuizCreateAPI, '/api/quiz/create')
api.add_resource(DeleteQuizAPI, '/api/quiz/delete/<int:quiz_id>')
api.add_resource(ModuleQuizzesAPI, '/api/modules/<int:module_id>/quizzes')

# Doubts
api.add_resource(MentorDoubtAPI, '/api/doubts/<int:mentor_id>')
api.add_resource(ReplyToDoubtAPI, '/api/doubt/reply')
api.add_resource(DeleteDoubtAPI, '/api/doubt/delete/<int:doubt_id>')
api.add_resource(ModuleMentorAPI, '/api/modules/<int:module_id>/mentor')
api.add_resource(StudentDoubtsAPI, "/api/student/doubts", "/api/student/doubts/<int:doubt_id>")



# Notifications
api.add_resource(NotificationAPI, '/api/notifications/<int:user_id>')

# Attempts
api.add_resource(StudentAttemptsAPI, '/api/student/<int:student_id>/attempts')

# Reports
api.add_resource(StudentReportAPI, '/api/reports/<int:student_id>')
api.add_resource(DeleteReportAPI, '/api/reports/delete/<int:report_id>')

# Tips
api.add_resource(TipListAPI, '/api/tips')
api.add_resource(TipsWithViewedStatusAPI, '/api/tips/with-viewed-status/<int:parent_id>')
api.add_resource(ParentViewedTipsAPI, '/api/tips/viewed/<int:parent_id>')
api.add_resource(MarkTipViewedAPI, '/api/tips/viewed')
api.add_resource(DeleteTipAPI, '/api/tips/delete/<int:tip_id>')

# Complaints
api.add_resource(FileComplaintAPI, '/api/complaints/file')
api.add_resource(ComplaintListAPI, '/api/complaints')
api.add_resource(UserComplaintsAPI, '/api/complaints/user/<int:user_id>')
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
api.add_resource(EditProfileAPI_Mentor, '/api/profile/mentor/edit')

# Preferences
api.add_resource(ThemePrefsAPI, '/api/prefs/theme/<int:user_id>', '/api/prefs/theme')
api.add_resource(NotificationPrefsAPI, '/api/prefs/notifications/<int:user_id>', '/api/prefs/notifications', '/api/notifications/prefs/<int:user_id>', '/api/notifications/prefs')

# Parent Management
api.add_resource(ParentChildrenAPI, '/api/parents/children/<int:parent_id>')
api.add_resource(LinkChildAPI, '/api/parents/link')
api.add_resource(UnlinkChildAPI, '/api/parents/unlink')
api.add_resource(AvailableStudentsAPI, '/api/parents/available-students/<int:parent_id>')

# Activity
# Register activity routes
api.add_resource(StudentActivityAPI, "/activity/student/<int:student_id>")
api.add_resource(ParentChildrenActivityAPI, "/activity/parent-children/<int:parent_id>")

api.add_resource(ParentDashboardAPI, '/api/dashboard/parent/<int:parent_id>')

# Student Dashboard
api.add_resource(StudentDashboardAPI, "/api/dashboard/<int:student_id>")

# Mentor Dashboard APIs
api.add_resource(VideoStatusAPI,'/api/videostatus/<int:user_id>')
api.add_resource(VideoStatusAPI_2,'/api/videostatus_2/<int:user_id>')
api.add_resource(VideoStatusAPI_3,'/api/videostatus_3/<int:user_id>')
#api.add_resource(QuizStatusAPI,'/api/quizstatus/<int:user_id'>)
api.add_resource(DoubtStatusAPI,'/api/doubtstatus/<int:user_id>')



# MENTOR VIDEO MODULES
api.add_resource(Mentor_VideoListAPI, '/api/modules/mentor/<int:user_id>')
api.add_resource(VideoListAPI,'/api/modules/videos/upload')
#api.add_resource(UploadModuleAPI, '/api/modules/upload')
#api.add_resource(DeleteModuleAPI, '/api/modules/delete/<int:module_id>')
#api.add_resource(ModuleWithContentAPI, "/api/modules_with_content")

#MENTOR TIPS
api.add_resource(MentorTipListAPI, '/api/tips/<int:user_id>')
api.add_resource(MentorUploadTipsAPI, '/api/tips/upload')



# Register routes
api.add_resource(UserPreferencesAPI, "/prefs/theme/<int:user_id>")
api.add_resource(NotificationsAPI, "/notifications/<int:user_id>")
api.add_resource(NotificationReadAPI, "/notifications/read/<int:notification_id>")
api.add_resource(TipsAPI, "/tips")
api.add_resource(TipsWithStatusAPI, "/tips/with-viewed-status/<int:parent_id>")
#api.add_resource(ParentChildrenAPI, "/parents/children/<int:parent_id>")
#api.add_resource(ProfileAPI, "/profile/<int:user_id>")
#api.add_resource(ParentDashboardAPI, "/dashboard/parent/<int:parent_id>")
#api.add_resource(ParentChildrenActivityAPI, "/activity/parent-children/<int:parent_id>")

if __name__ == '__main__':
    app.run(debug=True, port=5050)
