from django.contrib import admin
from .models import Profile, Banner, Item, UserInventory  # Import your models

@admin.register(Profile)  # Use decorator for registration
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'pity_counter')  # Fields to display in list view
    # ... other customizations (e.g., search_fields, list_filter)

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'start_date', 'end_date')

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'rarity', 'banner')

@admin.register(UserInventory)
class UserInventoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'quantity')