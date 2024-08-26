# from django.core.files.storage import default_storage
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Question, ServedQuestion, Section
# from django.shortcuts import render
# import speech_recognition as sr
# from difflib import SequenceMatcher
# from pydub import AudioSegment
# import subprocess
# import os
# import uuid
# import datetime
# import logging

# # Set up logging
# logger = logging.getLogger(__name__)

# # Set the ffmpeg path for pydub
# AudioSegment.converter = r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe'


# @api_view(['GET'])
# def get_sections(request):
#     sections = Section.objects.all()
#     return Response({"sections": [section.name for section in sections]}, status=status.HTTP_200_OK)


# @api_view(['GET'])
# def get_questions(request):
#     section = request.query_params.get('section')
#     if not section:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     questions = Question.objects.filter(section=section).order_by('?')[:10]

#     if not questions.exists():
#         return Response({"message": "No questions available for this section"}, status=status.HTTP_404_NOT_FOUND)

#     # Exclude 'id' from the response
#     questions_list = [{"text": question.text} for question in questions]

#     return Response({"questions": questions_list}, status=status.HTTP_200_OK)


# @api_view(['POST'])
# def submit_responses(request):
#     section = request.data.get('section')
#     responses = request.FILES.getlist('user_voice_responses')

#     if not section:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     if len(responses) != 10:
#         return Response({"message": "You must provide 10 responses."}, status=status.HTTP_400_BAD_REQUEST)

#     total_score = 0

#     for i in range(10):
#         user_voice_response = responses[i]

#         # Generate a unique file name and save the uploaded voice file
#         unique_filename = str(uuid.uuid4()) + os.path.splitext(user_voice_response.name)[1]
#         file_path = os.path.join('media', unique_filename)

#         try:
#             with default_storage.open(file_path, 'wb+') as destination:
#                 for chunk in user_voice_response.chunks():
#                     destination.write(chunk)
#         except Exception as e:
#             logger.error(f"Error saving file {unique_filename}: {e}")
#             continue

#         full_file_path = default_storage.path(file_path)

#         # Convert the file to WAV format if needed
#         wav_file_path = convert_to_wav(full_file_path)

#         if not wav_file_path:
#             logger.error(f"Failed to convert {full_file_path} to WAV.")
#             continue

#         # Assume all questions are valid for simplicity
#         question = Question.objects.filter(section=section).first()
#         if not question:
#             continue

#         served_question = ServedQuestion(
#             question=question,
#             user_voice_response=file_path
#         )
#         served_question.save()

#         # Calculate score based on the uploaded response
#         score = calculate_score(served_question)
#         served_question.score = score
#         served_question.save()

#         total_score += score

#     logger.info(f"Total Score: {total_score}")  # Log the total score
#     return Response({"total_score": total_score}, status=status.HTTP_201_CREATED)


# def calculate_score(served_question):
#     # Path to the saved user voice response
#     audio_file_path = convert_to_wav(served_question.user_voice_response.path)

#     # Expected answer for the question
#     expected_answer = served_question.question.text

#     # Convert audio to text
#     recognizer = sr.Recognizer()
#     try:
#         with sr.AudioFile(audio_file_path) as source:
#             audio = recognizer.record(source)
#             user_transcription = recognizer.recognize_google(audio)
#     except sr.UnknownValueError:
#         logger.warning(f"Could not understand the audio for question {served_question.question.id}.")
#         return 0  # Could not understand the audio
#     except sr.RequestError:
#         logger.error(f"Request error when processing audio for question {served_question.question.id}.")
#         return 0  # Could not request results

#     # Calculate similarity between user transcription and expected answer
#     score = get_similarity_score(user_transcription, expected_answer)
    
#     # Normalize the score as needed
#     return min(100, score)  # Example: max score is 100


# def get_similarity_score(user_text, expected_text):
#     # Use SequenceMatcher to get similarity ratio
#     return int(SequenceMatcher(None, user_text, expected_text).ratio() * 100)


# def convert_to_wav(file_path):
#     # Normalize the file path
#     file_path = os.path.normpath(file_path)

#     # Generate a unique name for the WAV file
#     timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
#     unique_wav_filename = f"{timestamp}_{uuid.uuid4().hex}.wav"
#     wav_file_path = os.path.join(os.path.dirname(file_path), unique_wav_filename)

#     # Convert audio file to WAV format using ffmpeg with specific options
#     command = [
#         r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe',
#         '-i', file_path,
#         '-f', 'wav',
#         '-acodec', 'pcm_s16le',
#         '-ar', '16000',
#         '-ac', '1',
#         wav_file_path
#     ]
#     try:
#         subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
#     except subprocess.CalledProcessError as e:
#         logger.error(f"FFmpeg conversion error: {e}")
#         return None

#     # Verify the output file was created
#     if not os.path.isfile(wav_file_path):
#         logger.error(f"Converted WAV file not found: {wav_file_path}")
#         return None

#     return wav_file_path


# def record_page(request):
#     section = request.GET.get('section', '')
#     return render(request, 'chatbot/record.html', {'section': section})


# from django.core.files.storage import default_storage
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Question, ServedQuestion, Section
# from django.shortcuts import render, redirect
# import speech_recognition as sr
# from difflib import SequenceMatcher
# from pydub import AudioSegment
# import subprocess
# import os
# import uuid
# import datetime
# import logging

# # Set up logging
# logger = logging.getLogger(__name__)

# # Set the ffmpeg path for pydub
# AudioSegment.converter = r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe'


# @api_view(['GET'])
# def get_sections(request):
#     sections = Section.objects.all()
#     return Response({"sections": [section.name for section in sections]}, status=status.HTTP_200_OK)


# @api_view(['GET'])
# def get_next_question(request):
#     # Get the section and the question number from session or query params
#     section_name = request.query_params.get('section')
#     question_number = request.session.get('question_number', 1)

#     if not section_name:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     # Get the questions from the section
#     # questions = Question.objects.filter(section__name=section_name).order_by('id')
#     questions = Question.objects.filter(section=section_name).order_by('id')


#     if not questions.exists():
#         return Response({"message": "No questions available for this section"}, status=status.HTTP_404_NOT_FOUND)

#     # Get the current question
#     try:
#         question = questions[question_number - 1]  # -1 because lists are 0-indexed
#     except IndexError:
#         # If no more questions are available
#         return Response({"message": "No more questions available"}, status=status.HTTP_200_OK)

#     # Save the next question number in session for the next request
#     request.session['question_number'] = question_number + 1

#     return Response({"question": {"text": question.text}}, status=status.HTTP_200_OK)


# @api_view(['POST'])
# def submit_response(request):
#     section = request.data.get('section')
#     user_voice_response = request.FILES.get('user_voice_response')

#     if not section:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     if not user_voice_response:
#         return Response({"message": "Voice response is required"}, status=status.HTTP_400_BAD_REQUEST)

#     # Retrieve the current question from session
#     question_number = request.session.get('question_number', 1) - 1  # Get the current question number

#     # Get the corresponding question based on section and question number
#     questions = Question.objects.filter(section__name=section).order_by('id')

#     try:
#         question = questions[question_number - 1]
#     except IndexError:
#         return Response({"message": "Invalid question number"}, status=status.HTTP_400_BAD_REQUEST)

#     # Generate a unique file name and save the uploaded voice file
#     unique_filename = str(uuid.uuid4()) + os.path.splitext(user_voice_response.name)[1]
#     file_path = os.path.join('media', unique_filename)

#     try:
#         with default_storage.open(file_path, 'wb+') as destination:
#             for chunk in user_voice_response.chunks():
#                 destination.write(chunk)
#     except Exception as e:
#         logger.error(f"Error saving file {unique_filename}: {e}")
#         return Response({"message": "Failed to save voice response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     full_file_path = default_storage.path(file_path)

#     # Convert the file to WAV format if needed
#     wav_file_path = convert_to_wav(full_file_path)

#     if not wav_file_path:
#         logger.error(f"Failed to convert {full_file_path} to WAV.")
#         return Response({"message": "Failed to convert voice response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     # Create ServedQuestion record
#     served_question = ServedQuestion(
#         question=question,
#         user_voice_response=file_path
#     )
#     served_question.save()

#     # Calculate score based on the uploaded response
#     score = calculate_score(served_question)
#     served_question.score = score
#     served_question.save()

#     return Response({"score": score}, status=status.HTTP_201_CREATED)


# def calculate_score(served_question):
#     # Path to the saved user voice response
#     audio_file_path = convert_to_wav(served_question.user_voice_response.path)

#     # Expected answer for the question
#     expected_answer = served_question.question.text

#     # Convert audio to text
#     recognizer = sr.Recognizer()
#     try:
#         with sr.AudioFile(audio_file_path) as source:
#             audio = recognizer.record(source)
#             user_transcription = recognizer.recognize_google(audio)
#     except sr.UnknownValueError:
#         logger.warning(f"Could not understand the audio for question {served_question.question.id}.")
#         return 0  # Could not understand the audio
#     except sr.RequestError:
#         logger.error(f"Request error when processing audio for question {served_question.question.id}.")
#         return 0  # Could not request results

#     # Calculate similarity between user transcription and expected answer
#     score = get_similarity_score(user_transcription, expected_answer)
    
#     # Normalize the score as needed
#     return min(100, score)  # Example: max score is 100


# def get_similarity_score(user_text, expected_text):
#     # Use SequenceMatcher to get similarity ratio
#     return int(SequenceMatcher(None, user_text, expected_text).ratio() * 100)


# def convert_to_wav(file_path):
#     # Normalize the file path
#     file_path = os.path.normpath(file_path)

#     # Generate a unique name for the WAV file
#     timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
#     unique_wav_filename = f"{timestamp}_{uuid.uuid4().hex}.wav"
#     wav_file_path = os.path.join(os.path.dirname(file_path), unique_wav_filename)

#     # Convert audio file to WAV format using ffmpeg with specific options
#     command = [
#         r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe',
#         '-i', file_path,
#         '-f', 'wav',
#         '-acodec', 'pcm_s16le',
#         '-ar', '16000',
#         '-ac', '1',
#         wav_file_path
#     ]
#     try:
#         subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
#     except subprocess.CalledProcessError as e:
#         logger.error(f"FFmpeg conversion error: {e}")
#         return None

#     # Verify the output file was created
#     if not os.path.isfile(wav_file_path):
#         logger.error(f"Converted WAV file not found: {wav_file_path}")
#         return None

#     return wav_file_path


# def record_page(request):
#     section = request.GET.get('section', '')
#     return render(request, 'chatbot/record.html', {'section': section})




# from django.core.files.storage import default_storage
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Question, ServedQuestion, Section
# from django.shortcuts import render
# import speech_recognition as sr
# from difflib import SequenceMatcher
# from pydub import AudioSegment
# import subprocess
# import os
# import uuid
# import datetime
# import logging

# # Set up logging
# logger = logging.getLogger(__name__)

# # Set the ffmpeg path for pydub
# AudioSegment.converter = r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe'

# @api_view(['GET'])
# def get_sections(request):
#     sections = Section.objects.all()
#     return Response({"sections": [section.name for section in sections]}, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def get_next_question(request):
#     # Get the section and the question number from session or query params
#     section_name = request.query_params.get('section')
#     question_number = request.session.get('question_number', 1)

#     logger.debug(f"Received section: {section_name}, question_number: {question_number}")

#     if not section_name:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     # Get the questions from the section
#     questions = Question.objects.filter(section=section_name).order_by('id')

#     if not questions.exists():
#         return Response({"message": "No questions available for this section"}, status=status.HTTP_404_NOT_FOUND)

#     # Get the current question
#     try:
#         question = questions[question_number - 1]  # -1 because lists are 0-indexed
#     except IndexError:
#         # If no more questions are available
#         return Response({"message": "No more questions available"}, status=status.HTTP_200_OK)

#     # Save the next question number in session for the next request
#     request.session['question_number'] = question_number + 1

#     return Response({"question": {"text": question.text}}, status=status.HTTP_200_OK)

# @api_view(['POST'])
# def submit_response(request):
#     section = request.data.get('section')
#     user_voice_response = request.FILES.get('user_voice_response')

#     if not section:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     if not user_voice_response:
#         return Response({"message": "Voice response is required"}, status=status.HTTP_400_BAD_REQUEST)

#     # Retrieve the current question from session
#     question_number = request.session.get('question_number', 1) - 1  # Get the current question number

#     # Get the corresponding question based on section and question number
#     questions = Question.objects.filter(section=section).order_by('id')

#     try:
#         question = questions[question_number]
#     except IndexError:
#         return Response({"message": "Invalid question number"}, status=status.HTTP_400_BAD_REQUEST)

#     # Generate a unique file name and save the uploaded voice file
#     unique_filename = str(uuid.uuid4()) + os.path.splitext(user_voice_response.name)[1]
#     file_path = os.path.join('media', unique_filename)

#     try:
#         with default_storage.open(file_path, 'wb+') as destination:
#             for chunk in user_voice_response.chunks():
#                 destination.write(chunk)
#     except Exception as e:
#         logger.error(f"Error saving file {unique_filename}: {e}")
#         return Response({"message": "Failed to save voice response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     full_file_path = default_storage.path(file_path)

#     # Convert the file to WAV format if needed
#     wav_file_path = convert_to_wav(full_file_path)

#     if not wav_file_path:
#         logger.error(f"Failed to convert {full_file_path} to WAV.")
#         return Response({"message": "Failed to convert voice response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     # Create ServedQuestion record
#     served_question = ServedQuestion(
#         question=question,
#         user_voice_response=file_path
#     )
#     served_question.save()

#     # Calculate score based on the uploaded response
#     score = calculate_score(served_question)
#     served_question.score = score
#     served_question.save()

#     return Response({"score": score}, status=status.HTTP_201_CREATED)

# def calculate_score(served_question):
#     # Path to the saved user voice response
#     audio_file_path = convert_to_wav(served_question.user_voice_response.path)

#     # Expected answer for the question
#     expected_answer = served_question.question.text

#     # Convert audio to text
#     recognizer = sr.Recognizer()
#     try:
#         with sr.AudioFile(audio_file_path) as source:
#             audio = recognizer.record(source)
#             user_transcription = recognizer.recognize_google(audio)
#     except sr.UnknownValueError:
#         logger.warning(f"Could not understand the audio for question {served_question.question.id}.")
#         return 0  # Could not understand the audio
#     except sr.RequestError:
#         logger.error(f"Request error when processing audio for question {served_question.question.id}.")
#         return 0  # Could not request results

#     # Calculate similarity between user transcription and expected answer
#     score = get_similarity_score(user_transcription, expected_answer)
    
#     # Normalize the score as needed
#     return min(100, score)  # Example: max score is 100

# def get_similarity_score(user_text, expected_text):
#     # Use SequenceMatcher to get similarity ratio
#     return int(SequenceMatcher(None, user_text, expected_text).ratio() * 100)

# def convert_to_wav(file_path):
#     # Normalize the file path
#     file_path = os.path.normpath(file_path)

#     # Generate a unique name for the WAV file
#     timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
#     unique_wav_filename = f"{timestamp}_{uuid.uuid4().hex}.wav"
#     wav_file_path = os.path.join(os.path.dirname(file_path), unique_wav_filename)

#     # Convert audio file to WAV format using ffmpeg with specific options
#     command = [
#         r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe',
#         '-i', file_path,
#         '-f', 'wav',
#         '-acodec', 'pcm_s16le',
#         '-ar', '16000',
#         '-ac', '1',
#         wav_file_path
#     ]
#     try:
#         subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
#     except subprocess.CalledProcessError as e:
#         logger.error(f"FFmpeg conversion error: {e}")
#         return None

#     # Verify the output file was created
#     if not os.path.isfile(wav_file_path):
#         logger.error(f"Converted WAV file not found: {wav_file_path}")
#         return None

#     return wav_file_path

# def record_page(request):
#     section = request.GET.get('section', '')
#     return render(request, 'chatbot/record.html', {'section': section})



# from django.core.files.storage import default_storage
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Question, ServedQuestion, Section
# from django.shortcuts import render
# import speech_recognition as sr
# from difflib import SequenceMatcher
# from pydub import AudioSegment
# import subprocess
# import os
# import uuid
# import datetime
# import logging

# # Set up logging
# logger = logging.getLogger(__name__)

# # Set the ffmpeg path for pydub
# AudioSegment.converter = r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe'

# @api_view(['GET'])
# def get_sections(request):
#     sections = Section.objects.all()
#     return Response({"sections": [section.name for section in sections]}, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def get_questions(request):
#     section = request.query_params.get('section')
#     if not section:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     questions = Question.objects.filter(section=section).order_by('id')
#     questions_data = [{'text': q.text} for q in questions]

#     return Response({"questions": questions_data}, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def get_next_question(request):
#     # Get the section and the question number from session or query params
#     section_name = request.query_params.get('section')
#     question_number = request.session.get('question_number', 1)

#     logger.debug(f"Received section: {section_name}, question_number: {question_number}")

#     if not section_name:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     # Get the questions from the section
#     questions = Question.objects.filter(section=section_name).order_by('id')

#     if not questions.exists():
#         return Response({"message": "No questions available for this section"}, status=status.HTTP_404_NOT_FOUND)

#     # Get the current question
#     try:
#         question = questions[question_number - 1]  # -1 because lists are 0-indexed
#     except IndexError:
#         # If no more questions are available
#         return Response({"message": "No more questions available"}, status=status.HTTP_200_OK)

#     # Save the next question number in session for the next request
#     request.session['question_number'] = question_number + 1

#     return Response({"question": {"text": question.text}}, status=status.HTTP_200_OK)

# @api_view(['POST'])
# def submit_response(request):
#     section = request.data.get('section')
#     user_voice_response = request.FILES.get('user_voice_response')

#     if not section:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     if not user_voice_response:
#         return Response({"message": "Voice response is required"}, status=status.HTTP_400_BAD_REQUEST)

#     # Retrieve the current question from session
#     question_number = request.session.get('question_number', 1) - 1  # Get the current question number

#     # Get the corresponding question based on section and question number
#     questions = Question.objects.filter(section=section).order_by('id')

#     try:
#         question = questions[question_number]
#     except IndexError:
#         return Response({"message": "Invalid question number"}, status=status.HTTP_400_BAD_REQUEST)

#     # Generate a unique file name and save the uploaded voice file
#     unique_filename = str(uuid.uuid4()) + os.path.splitext(user_voice_response.name)[1]
#     file_path = os.path.join('media', unique_filename)

#     try:
#         with default_storage.open(file_path, 'wb+') as destination:
#             for chunk in user_voice_response.chunks():
#                 destination.write(chunk)
#     except Exception as e:
#         logger.error(f"Error saving file {unique_filename}: {e}")
#         return Response({"message": "Failed to save voice response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     full_file_path = default_storage.path(file_path)

#     # Convert the file to WAV format if needed
#     wav_file_path = convert_to_wav(full_file_path)

#     if not wav_file_path:
#         logger.error(f"Failed to convert {full_file_path} to WAV.")
#         return Response({"message": "Failed to convert voice response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     # Create ServedQuestion record
#     served_question = ServedQuestion(
#         question=question,
#         user_voice_response=file_path
#     )
#     served_question.save()

#     # Calculate score based on the uploaded response
#     score = calculate_score(served_question)
#     served_question.score = score
#     served_question.save()

#     return Response({"score": score}, status=status.HTTP_201_CREATED)

# def calculate_score(served_question):
#     # Path to the saved user voice response
#     audio_file_path = convert_to_wav(served_question.user_voice_response.path)

#     # Expected answer for the question
#     expected_answer = served_question.question.text

#     # Convert audio to text
#     recognizer = sr.Recognizer()
#     try:
#         with sr.AudioFile(audio_file_path) as source:
#             audio = recognizer.record(source)
#             user_transcription = recognizer.recognize_google(audio)
#     except sr.UnknownValueError:
#         logger.warning(f"Could not understand the audio for question {served_question.question.id}.")
#         return 0  # Could not understand the audio
#     except sr.RequestError:
#         logger.error(f"Request error when processing audio for question {served_question.question.id}.")
#         return 0  # Could not request results

#     # Calculate similarity between user transcription and expected answer
#     score = get_similarity_score(user_transcription, expected_answer)
    
#     # Normalize the score as needed
#     return min(100, score)  # Example: max score is 100

# def get_similarity_score(user_text, expected_text):
#     # Use SequenceMatcher to get similarity ratio
#     return int(SequenceMatcher(None, user_text, expected_text).ratio() * 100)

# def convert_to_wav(file_path):
#     # Normalize the file path
#     file_path = os.path.normpath(file_path)

#     # Generate a unique name for the WAV file
#     timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
#     unique_wav_filename = f"{timestamp}_{uuid.uuid4().hex}.wav"
#     wav_file_path = os.path.join(os.path.dirname(file_path), unique_wav_filename)

#     # Convert audio file to WAV format using ffmpeg with specific options
#     command = [
#         r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe',
#         '-i', file_path,
#         '-f', 'wav',
#         '-acodec', 'pcm_s16le',
#         '-ar', '16000',
#         '-ac', '1',
#         wav_file_path
#     ]
#     try:
#         subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
#     except subprocess.CalledProcessError as e:
#         logger.error(f"FFmpeg conversion error: {e}")
#         return None

#     # Verify the output file was created
#     if not os.path.isfile(wav_file_path):
#         logger.error(f"Converted WAV file not found: {wav_file_path}")
#         return None

#     return wav_file_path

# @api_view(['GET'])
# def record_page(request):
#     section = request.GET.get('section', '')
#     return render(request, 'chatbot/record.html', {'section': section})

# from django.core.files.storage import default_storage
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Question, ServedQuestion, Section
# from django.shortcuts import render
# import speech_recognition as sr
# from difflib import SequenceMatcher
# from pydub import AudioSegment
# import subprocess
# import os
# import uuid
# import datetime
# import logging

# # Set up logging
# logger = logging.getLogger(__name__)

# # Set the ffmpeg path for pydub
# AudioSegment.converter = r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe'

# @api_view(['GET'])
# def get_sections(request):
#     sections = Section.objects.all()
#     return Response({"sections": [section.name for section in sections]}, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def get_questions(request):
#     section = request.query_params.get('section')
#     if not section:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     questions = Question.objects.filter(section=section).order_by('id')
#     questions_data = [{'text': q.text} for q in questions]

#     return Response({"questions": questions_data}, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def get_next_question(request):
#     # Get the section and the question number from session or query params
#     section_name = request.query_params.get('section')
#     question_number = request.session.get('question_number', 1)

#     logger.debug(f"Received section: {section_name}, question_number: {question_number}")

#     if not section_name:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     # Get the questions from the section
#     questions = Question.objects.filter(section=section_name).order_by('id')

#     if not questions.exists():
#         return Response({"message": "No questions available for this section"}, status=status.HTTP_404_NOT_FOUND)

#     # Get the current question
#     try:
#         question = questions[question_number - 1]  # -1 because lists are 0-indexed
#     except IndexError:
#         # If no more questions are available
#         return Response({"message": "No more questions available"}, status=status.HTTP_200_OK)

#     # Save the next question number in session for the next request
#     request.session['question_number'] = question_number + 1

#     return Response({"question": {"text": question.text}}, status=status.HTTP_200_OK)

# @api_view(['POST'])
# def submit_response(request):
#     section = request.data.get('section')
#     user_voice_responses = request.FILES.getlist('user_voice_response')

#     if not section:
#         return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

#     if not user_voice_responses:
#         return Response({"message": "Voice responses are required"}, status=status.HTTP_400_BAD_REQUEST)

#     # Retrieve the current question from session
#     question_number = request.session.get('question_number', 1) - 1  # Get the current question number

#     # Get the corresponding question based on section and question number
#     questions = Question.objects.filter(section=section).order_by('id')

#     try:
#         question = questions[question_number]
#     except IndexError:
#         return Response({"message": "Invalid question number"}, status=status.HTTP_400_BAD_REQUEST)

#     scores = []
#     for user_voice_response in user_voice_responses:
#         # Generate a unique file name and save the uploaded voice file
#         unique_filename = str(uuid.uuid4()) + os.path.splitext(user_voice_response.name)[1]
#         file_path = os.path.join('media', unique_filename)

#         try:
#             with default_storage.open(file_path, 'wb+') as destination:
#                 for chunk in user_voice_response.chunks():
#                     destination.write(chunk)
#         except Exception as e:
#             logger.error(f"Error saving file {unique_filename}: {e}")
#             return Response({"message": "Failed to save voice response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         full_file_path = default_storage.path(file_path)

#         # Convert the file to WAV format if needed
#         wav_file_path = convert_to_wav(full_file_path)

#         if not wav_file_path:
#             logger.error(f"Failed to convert {full_file_path} to WAV.")
#             return Response({"message": "Failed to convert voice response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         # Create ServedQuestion record
#         served_question = ServedQuestion(
#             question=question,
#             user_voice_response=file_path
#         )
#         served_question.save()

#         # Calculate score based on the uploaded response
#         score = calculate_score(served_question)
#         served_question.score = score
#         served_question.save()

#         scores.append(score)
#         logger.info(f"Score for question {question.id}: {score}")

#     logger.info(f"Scores for all questions: {scores}")
#     return Response({"scores": scores}, status=status.HTTP_201_CREATED)

# def calculate_score(served_question):
#     # Path to the saved user voice response
#     audio_file_path = convert_to_wav(served_question.user_voice_response.path)

#     # Expected answer for the question
#     expected_answer = served_question.question.text

#     # Convert audio to text
#     recognizer = sr.Recognizer()
#     try:
#         with sr.AudioFile(audio_file_path) as source:
#             audio = recognizer.record(source)
#             user_transcription = recognizer.recognize_google(audio)
#     except sr.UnknownValueError:
#         logger.warning(f"Could not understand the audio for question {served_question.question.id}.")
#         return 0  # Could not understand the audio
#     except sr.RequestError:
#         logger.error(f"Request error when processing audio for question {served_question.question.id}.")
#         return 0  # Could not request results

#     # Calculate similarity between user transcription and expected answer
#     score = get_similarity_score(user_transcription, expected_answer)
    
#     # Normalize the score as needed
#     return min(100, score)  # Example: max score is 100

# def get_similarity_score(user_text, expected_text):
#     # Use SequenceMatcher to get similarity ratio
#     return int(SequenceMatcher(None, user_text, expected_text).ratio() * 100)

# def convert_to_wav(file_path):
#     # Normalize the file path
#     file_path = os.path.normpath(file_path)

#     # Generate a unique name for the WAV file
#     timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
#     unique_wav_filename = f"{timestamp}_{uuid.uuid4().hex}.wav"
#     wav_file_path = os.path.join(os.path.dirname(file_path), unique_wav_filename)

#     # Convert audio file to WAV format using ffmpeg with specific options
#     command = [
#         r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe',
#         '-i', file_path,
#         '-f', 'wav',
#         '-acodec', 'pcm_s16le',
#         '-ar', '16000',
#         '-ac', '1',
#         wav_file_path
#     ]
#     try:
#         subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
#     except subprocess.CalledProcessError as e:
#         logger.error(f"FFmpeg conversion error: {e}")
#         return None

#     # Verify the output file was created
#     if not os.path.isfile(wav_file_path):
#         logger.error(f"Converted WAV file not found: {wav_file_path}")
#         return None

#     return wav_file_path

# @api_view(['GET'])
# def record_page(request):
#     section = request.GET.get('section', '')
#     return render(request, 'chatbot/record.html', {'section': section})




from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Question, ServedQuestion, Section
from django.shortcuts import render
import speech_recognition as sr
from difflib import SequenceMatcher
from pydub import AudioSegment
import subprocess
import os
import uuid
import datetime
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Set the ffmpeg path for pydub
AudioSegment.converter = r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe'

@api_view(['GET'])
def get_sections(request):
    sections = Section.objects.all()
    return Response({"sections": [section.name for section in sections]}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_questions(request):
    section = request.query_params.get('section')
    if not section:
        return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

    questions = Question.objects.filter(section=section).order_by('id')
    questions_data = [{'text': q.text} for q in questions]

    return Response({"questions": questions_data}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_next_question(request):
    # Get the section and the question number from session or query params
    section_name = request.query_params.get('section')
    question_number = request.session.get('question_number', 1)

    logger.debug(f"Received section: {section_name}, question_number: {question_number}")

    if not section_name:
        return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Get the questions from the section
    questions = Question.objects.filter(section=section_name).order_by('id')

    if not questions.exists():
        return Response({"message": "No questions available for this section"}, status=status.HTTP_404_NOT_FOUND)

    # Get the current question
    try:
        question = questions[question_number - 1]  # -1 because lists are 0-indexed
    except IndexError:
        # If no more questions are available
        return Response({"message": "No more questions available"}, status=status.HTTP_200_OK)

    # Save the next question number in session for the next request
    request.session['question_number'] = question_number + 1

    return Response({"question": {"text": question.text}}, status=status.HTTP_200_OK)

@api_view(['POST'])
def submit_response(request):
    logger.debug(f"Request data: {request.data}")
    logger.debug(f"Request files: {request.FILES}")

    section = request.data.get('section')
    user_voice_responses = request.FILES.getlist('user_voice_response')

    if not section:
        return Response({"message": "Section is required"}, status=status.HTTP_400_BAD_REQUEST)

    if not user_voice_responses:
        return Response({"message": "Voice responses are required"}, status=status.HTTP_400_BAD_REQUEST)

    logger.debug(f"Number of voice responses received: {len(user_voice_responses)}")

    # Retrieve the current question from session
    question_number = request.session.get('question_number', 1) - 1  # Get the current question number

    # Get the corresponding question based on section and question number
    questions = Question.objects.filter(section=section).order_by('id')
    
    try:
        question = questions[question_number]
    except IndexError:
        return Response({"message": "Invalid question number"}, status=status.HTTP_400_BAD_REQUEST)

    scores = []
    for user_voice_response in user_voice_responses:
        # Generate a unique file name and save the uploaded voice file
        unique_filename = str(uuid.uuid4()) + os.path.splitext(user_voice_response.name)[1]
        file_path = os.path.join('media', unique_filename)
        logger.debug(f"Saving file to: {file_path}")

        try:
            with default_storage.open(file_path, 'wb+') as destination:
                for chunk in user_voice_response.chunks():
                    destination.write(chunk)
        except Exception as e:
            logger.error(f"Error saving file {unique_filename}: {e}")
            return Response({"message": "Failed to save voice response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        full_file_path = default_storage.path(file_path)

        # Convert the file to WAV format if needed
        wav_file_path = convert_to_wav(full_file_path)

        if not wav_file_path:
            logger.error(f"Failed to convert {full_file_path} to WAV.")
            return Response({"message": "Failed to convert voice response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Create ServedQuestion record
        served_question = ServedQuestion(
            question=question,
            user_voice_response=file_path
        )
        served_question.save()

        # Calculate score based on the uploaded response
        score = calculate_score(served_question)
        served_question.score = score
        served_question.save()

        scores.append(score)

    return Response({"scores": scores}, status=status.HTTP_201_CREATED)


def calculate_score(served_question):
    # Path to the saved user voice response
    audio_file_path = convert_to_wav(served_question.user_voice_response.path)

    # Expected answer for the question
    expected_answer = served_question.question.text

    # Convert audio to text
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file_path) as source:
            audio = recognizer.record(source)
            user_transcription = recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        logger.warning(f"Could not understand the audio for question {served_question.question.id}.")
        return 0  # Could not understand the audio
    except sr.RequestError:
        logger.error(f"Request error when processing audio for question {served_question.question.id}.")
        return 0  # Could not request results

    # Calculate similarity between user transcription and expected answer
    score = get_similarity_score(user_transcription, expected_answer)
    
    # Normalize the score as needed
    return min(100, score)  # Example: max score is 100

def get_similarity_score(user_text, expected_text):
    # Use SequenceMatcher to get similarity ratio
    return int(SequenceMatcher(None, user_text, expected_text).ratio() * 100)

def convert_to_wav(file_path):
    # Normalize the file path
    file_path = os.path.normpath(file_path)

    # Generate a unique name for the WAV file
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_wav_filename = f"{timestamp}_{uuid.uuid4().hex}.wav"
    wav_file_path = os.path.join(os.path.dirname(file_path), unique_wav_filename)

    # Convert audio file to WAV format using ffmpeg with specific options
    command = [
        r'F:\AI\ffmg\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe',
        '-i', file_path,
        '-f', 'wav',
        '-acodec', 'pcm_s16le',
        '-ar', '16000',
        '-ac', '1',
        wav_file_path
    ]
    try:
        subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg conversion error: {e}")
        return None

    # Verify the output file was created
    if not os.path.isfile(wav_file_path):
        logger.error(f"Converted WAV file not found: {wav_file_path}")
        return None

    return wav_file_path

@api_view(['GET'])
def record_page(request):
    section = request.GET.get('section', '')
    return render(request, 'chatbot/record.html', {'section': section})


