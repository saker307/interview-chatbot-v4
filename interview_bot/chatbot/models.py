
# from django.db import models


# class Section(models.Model):
#     name = models.CharField(max_length=255)

#     def __str__(self):
#         return self.name

# class Question(models.Model):
#     section = models.CharField(max_length=255)
#     text = models.TextField()

# class ServedQuestion(models.Model):
#     question = models.ForeignKey(Question, on_delete=models.CASCADE)
#     user_voice_response = models.FileField(upload_to='responses/')
#     score = models.IntegerField(null=True, blank=True)

# from django.db import models


# class Section(models.Model):
#     name = models.CharField(max_length=255)

#     def __str__(self):
#         return self.name


# class Question(models.Model):
#     section = models.CharField(max_length=255)  # Now a CharField instead of a ForeignKey
#     text = models.TextField()

#     def __str__(self):
#         return self.text


# class ServedQuestion(models.Model):
#     question = models.ForeignKey(Question, on_delete=models.CASCADE)
#     user_voice_response = models.FileField(upload_to='responses/')
#     score = models.IntegerField(null=True, blank=True)  # Allows null and blank scores

#     def __str__(self):
#         return f"{self.question.text} - Score: {self.score if self.score is not None else 'Pending'}"


from django.db import models

class Section(models.Model):
    name = models.CharField(max_length=255, unique=True)  # Ensuring unique section names

    def __str__(self):
        return self.name


class Question(models.Model):
    section = models.CharField(max_length=255)  # Stores the section name directly as a string
    text = models.TextField()  # Stores the text of the question

    def __str__(self):
        return self.text


class ServedQuestion(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)  # Links to the Question model
    user_voice_response = models.FileField(upload_to='responses/')  # Stores the user's voice response file
    score = models.IntegerField(null=True, blank=True)  # Optional score field for evaluation

    def __str__(self):
        return f"{self.question.text} - Score: {self.score if self.score is not None else 'Pending'}"



# from django.db import models

# class Section(models.Model):
#     name = models.CharField(max_length=255, unique=True)  # Ensuring unique section names

#     def __str__(self):
#         return self.name

# class Question(models.Model):
#     section = models.ForeignKey(Section, on_delete=models.CASCADE)  # Links to the Section model
#     text = models.TextField()  # Stores the text of the question

#     def __str__(self):
#         return self.text

# class ServedQuestion(models.Model):
#     question = models.ForeignKey(Question, on_delete=models.CASCADE)  # Links to the Question model
#     user_voice_response = models.FileField(upload_to='responses/')  # Stores the user's voice response file
#     score = models.IntegerField(null=True, blank=True)  # Optional score field for evaluation

#     def __str__(self):
#         return f"{self.question.text} - Score: {self.score if self.score is not None else 'Pending'}"

