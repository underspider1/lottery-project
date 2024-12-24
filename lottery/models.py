from django.db import models

class LotteryTicket(models.Model):
    user_name = models.CharField(max_length=100)
    ticket_number = models.CharField(max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)

