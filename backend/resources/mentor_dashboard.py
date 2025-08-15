from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from utils.auth_utils import role_required

from models import (
    get_mentor_video_status,
    #get_mentor_quiz_status,
    get_mentor_doubt_status,

)

class VideoStatusAPI(Resource):
    @jwt_required()
    @role_required('mentor')
    def get(self,user_id):
        """Get all users (Admin only)"""
        data=get_mentor_video_status(user_id) 
        count_approved=0
        count_not_approved=0
        for row in data:
            if row["isApproved"]==0:
                count_not_approved=count_not_approved+1
            else:
                count_approved=count_approved+1
        video_approved_status={
            "Approved":count_approved,
            "Not Approved":count_not_approved
        }
        return video_approved_status
    
class VideoStatusAPI_2(Resource):
    @jwt_required()
    @role_required('mentor')
    def get(self,user_id):
        month_dict={'01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'May','06':'Jun','07':'Jul','08':'Aug','09':'Sep','10':'Oct','11':'Nov','12':'Dec'}
        month_video_count={'Jan':0,'Feb':0,'Mar':0,'Apr':0,'May':0,'Jun':0,'Jul':0,'Aug':0,'Sep':0,'Oct':0,'Nov':0,'Dec':0}
        """Get all users (Admin only)"""
        data=get_mentor_video_status(user_id) 
        for row in data:
            k=row["timestamp"]
            list=k.split("-")
            month_number=list[1]
            print(month_number)
            month_name=month_dict[month_number]
            month_video_count[month_name]=month_video_count[month_name]+1
        
        print(month_video_count)
        return  month_video_count   
    
class VideoStatusAPI_3(Resource):
    @jwt_required()
    @role_required('mentor')
    def get(self,user_id):
        month_dict={'01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'May','06':'Jun','07':'Jul','08':'Aug','09':'Sep','10':'Oct','11':'Nov','12':'Dec'}
        month_likes_count={'Jan':0,'Feb':0,'Mar':0,'Apr':0,'May':0,'Jun':0,'Jul':0,'Aug':0,'Sep':0,'Oct':0,'Nov':0,'Dec':0}
        month_views_count={'Jan':0,'Feb':0,'Mar':0,'Apr':0,'May':0,'Jun':0,'Jul':0,'Aug':0,'Sep':0,'Oct':0,'Nov':0,'Dec':0}
        """Get all users (Admin only)"""
        data=get_mentor_video_status(user_id) 
        for row in data:
            k=row["timestamp"]
            list=k.split("-")
            month_number=list[1]
            print(month_number)
            likes=row["likes"]
            views=row["views"]
            month_name=month_dict[month_number]
            month_likes_count[month_name]=month_likes_count[month_name]+likes
            month_views_count[month_name]=month_views_count[month_name]+views
        
        month_data=[]
        for keys in month_likes_count:
            data={
                "month":keys,
                "views":month_views_count[keys],
                "likes":month_likes_count[keys]
            }
            month_data.append(data)
        

        return  month_data
           
            


    
class DoubtStatusAPI(Resource):
    @jwt_required()
    @role_required('mentor')
    def get(self,user_id):
        """Get all users (Admin only)"""
        data=get_mentor_doubt_status(user_id) 
        count_answered=0
        count_not_answered=0
        for row in data:
            if row["answer"]==None:
                count_not_answered=count_not_answered+1
            else:
                count_answered=count_answered+1
        doubt_status={
            "Answered":count_answered,
            "Not Answered":count_not_answered
        }
        print(doubt_status)
        return doubt_status


    