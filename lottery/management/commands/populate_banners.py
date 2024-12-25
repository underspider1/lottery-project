from django.core.management.base import BaseCommand
from lottery.models import Banner, Item
import json
import os  # Import os

class Command(BaseCommand):
    help = "Populates banners and items from banners.js"

    def handle(self, *args, **options):
        # Get the absolute path to banners.js (adjust as needed)
        file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../lottery/static/lottery/js/banners.js')

        with open(file_path, 'r', encoding='utf-8') as f: # Use utf-8 encoding to correctly read characters
            banners_js = f.read()


        # Extract the banner data using a regular expression.  Adjust if your banners.js structure changes.

        import re
        match = re.search(r'const banners = ({.*?});', banners_js, re.DOTALL)
        if match:
            try:
                banners_data = json.loads(match.group(1)) #Correctly parse json data using json.loads, not eval
                for banner_id, banner_info in banners_data.items():
                    banner, created = Banner.objects.get_or_create(name=f"Banner {banner_id}") #Create banner with same name as in banners.js
                    if created:
                        self.stdout.write(self.style.SUCCESS(f"Created banner: {banner.name}"))

                    for rarity_key in ['characters5', 'featuredCharacters5', 'weapons5', 'featuredWeapons5', 'characters4', 'featuredCharacters4', 'weapons4', 'featuredWeapons4', 'weapons3']: #Correctly handle weapon banners
                        for item_name in banner_info.get(rarity_key, []):
                            is_featured = rarity_key == 'featuredCharacters5' or rarity_key == 'featuredWeapons5' #Correctly handle featured
                            is_promoted = rarity_key == 'featuredCharacters4' or rarity_key == 'featuredWeapons4' #Correctly handle promoted
                            rarity_value = int(rarity_key[0])  # Extract the rarity (e.g., 5 from 'characters5')
                            item, created = Item.objects.get_or_create(name=item_name, rarity=rarity_value, is_featured=is_featured, is_promoted=is_promoted)
                            banner.items.add(item)  #Add item to banner after it is created
                            if created:
                                self.stdout.write(self.style.SUCCESS(f"Created item: {item.name} (Rarity {item.rarity}, Featured: {item.is_featured}, Promoted: {item.is_promoted}) for banner {banner.name}"))


            except json.JSONDecodeError as e:
                self.stdout.write(self.style.ERROR(f"Error decoding JSON: {e}"))
        else:
            self.stdout.write(self.style.ERROR("Could not extract banner data from banners.js"))