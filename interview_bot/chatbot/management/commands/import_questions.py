from django.core.management.base import BaseCommand
from chatbot.models import Question

class Command(BaseCommand):
    help = 'Import sample questions into the database'

    def handle(self, *args, **options):
        questions = [
            {"section": "medical engineering", "text": "What is your understanding of medical engineering?"},
            {"section": "medical engineering", "text": "Describe a recent project related to medical devices."},
            {"section": "software engineering", "text": "What programming languages are you most comfortable with?"},
            {"section": "software engineering", "text": "Explain a complex software project you have worked on."},
        ]

        for q in questions:
            Question.objects.get_or_create(**q)

        self.stdout.write(self.style.SUCCESS('Successfully imported questions'))

