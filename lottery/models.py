from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.IntegerField(default=0)
    pity_counter = models.IntegerField(default=0)
    
    class Meta:
        app_label = 'lottery'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, balance=16000, pity_counter = 0)

class Banner(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='banner_images/', blank=True)  # New
    is_active = models.BooleanField(default=True)  # New
    start_date = models.DateTimeField(null=True, blank=True)  # New
    end_date = models.DateTimeField(null=True, blank=True)  # New
    featured_items = models.ManyToManyField('Item', related_name='featured_in_banners')

class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    RARITY_CHOICES = [  # New: Define rarity choices
        (3, 'Three Star'),
        (4, 'Four Star'),
        (5, 'Five Star'),
    ]
    rarity = models.IntegerField(choices=RARITY_CHOICES)  # Use choices
    image = models.ImageField(upload_to='item_images/', blank=True)
    banner = models.ForeignKey(Banner, on_delete=models.CASCADE, related_name='items', null=True)


class UserInventory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)