# from django.urls import path
# from .views import get_next_question , get_sections, submit_response, record_page

# urlpatterns = [
#     path('questions/', get_next_question, name='get_next_question'),
#     path('sections/', get_sections, name='get_sections'),
#     path('submit_response/', submit_response, name='submit_response'),
#     path('record/', record_page, name='record_page'),
# ]

from django.urls import path
from .views import get_next_question, get_sections, get_questions, submit_response, record_page

urlpatterns = [
    path('sections/', get_sections, name='get_sections'),
    path('questions/', get_questions, name='get_questions'),  # Added to handle the fetching of all questions for a section
    path('next-question/', get_next_question, name='get_next_question'),
    path('submit-response/', submit_response, name='submit_response'),
    path('record/', record_page, name='record_page'),
]
