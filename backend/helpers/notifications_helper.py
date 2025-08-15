from models import (
    create_notification,
    get_all_user_ids,
    get_mentor_id_for_student,
    get_parent_id_for_student,
    get_admin_ids
)

def send_notification(event_type, related_id=None, student_id=None, mentor_id=None, message=None):
    """
    Universal notification function.

    event_type: 
        'alert', 
        'doubt_student', 'doubt_mentor', 
        'complaint_raised', 'complaint_resolved',
        'quiz_attempt', 
        'mentor_registration', 'module_upload', 'content_approved'
    """

    # ALERT NOTIFICATION
    if event_type == "alert":
        for user_id in get_all_user_ids():
            create_notification(user_id, "alert", message or "New alert posted", related_id)

    # DOUBTS NOTIFICATION
    elif event_type == "doubt_student":  # Student posts doubt -> Notify mentor
        if mentor_id:
            create_notification(mentor_id, "doubt", message or "New doubt posted by student", related_id)

    elif event_type == "doubt_mentor":  # Mentor replies -> Notify student
        if student_id:
            create_notification(student_id, "doubt", message or "Mentor replied to your doubt", related_id)

    # COMPLAINTS NOTIFICATION
    elif event_type == "complaint_raised":
        if student_id:
            create_notification(student_id, "complaint", message or "Your complaint has been submitted", related_id)

    elif event_type == "complaint_resolved":
        if student_id:
            create_notification(student_id, "complaint", message or "Your complaint has been resolved", related_id)

    # QUIZ ATTEMPT NOTIFICATION
    elif event_type == "quiz_attempt":
        if student_id:
            create_notification(student_id, "quiz", message or "You have submitted the quiz", related_id)
            parent_id = get_parent_id_for_student(student_id)
            if parent_id:
                create_notification(parent_id, "quiz", f"Student {student_id} submitted a quiz", related_id)

    # ADMIN NOTIFICATION
    elif event_type == "mentor_registration":  # Notify admin
        for admin_id in get_admin_ids():
            create_notification(admin_id, "admin", message or "A new mentor has registered", related_id)

    elif event_type == "module_upload":  # Notify admin
        for admin_id in get_admin_ids():
            create_notification(admin_id, "admin", message or "Mentor uploaded new content", related_id)

    # MENTOR NOTIFICATION
    elif event_type == "content_approved":  # Notify mentor
        if mentor_id:
            create_notification(mentor_id, "mentor", message or "Your content has been approved", related_id)