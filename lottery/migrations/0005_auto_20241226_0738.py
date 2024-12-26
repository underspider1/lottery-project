from django.db import migrations
from lottery.models import Banner, Item, BannerType

def create_initial_banners(apps, schema_editor):  # Use apps.get_model
    Banner = apps.get_model('lottery', 'Banner')
    Item = apps.get_model('lottery', 'Item')
    BannerType = apps.get_model('lottery','BannerType')


    standard_banner, created = Banner.objects.get_or_create(
        name="Standard", banner_type=BannerType.STANDARD
    )

    if created:  # Only add items if the banner was just created
        item1 = Item.objects.create(name="5-Star Item", rarity=5, banner=standard_banner)
        # ... create other default items for the standard banner ...
        standard_banner.items.add(item1, item2, item3, ...)  # Correctly add items to banner

        # Create other banners (limited, weapon, etc.) here, following the same pattern.
        # For example:
        limited_banner, _ = Banner.objects.get_or_create( #If created is not needed - use _ instead
            name="Limited Character Banner",
            banner_type=BannerType.LIMITED_CHARACTER,
            # ... other fields ...
        )
        #Add items to limited_banner in the same way you do for standard_banner.

def reverse_initial_banners(apps, schema_editor): # Code to reverse the changes, if needed. Remove if not important
    Banner = apps.get_model('lottery', 'Banner')
    Item = apps.get_model('lottery', 'Item')
    Banner.objects.filter(name="Standard").delete()  # Delete items if rolling back
    #Delete other banners like limited_banner, etc.



class Migration(migrations.Migration):
    dependencies = [
        ('lottery', '0004_banner_banner_type'),  # Or your previous migration name
    ]

    operations = [
        migrations.RunPython(create_initial_banners, reverse_code=reverse_initial_banners) # For automatic deletion if needed. Remove reverse_code if you have nothing to delete.
    ]