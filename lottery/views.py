print("Views module loaded") 
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Banner, Item, UserInventory, Profile
import random
from django.contrib import messages # Import messages

# ... other views
def home_view(request):
    banners = Banner.objects.filter(is_active=True) # Retrieve only active banners.
    context = {'banners': banners}
    return render(request, 'lottery/home.html', context)

@login_required
def pull_view(request, banner_id):
    banner = get_object_or_404(Banner, pk=banner_id)
    profile = request.user.profile

    if request.method == 'POST':
        pull_type = request.POST.get('pull_type')
        cost = 160 if pull_type == 'single' else 1600

        if profile.balance >= cost:
            # ... (reduce balance)

            num_pulls = 1 if pull_type == 'single' else 10
            items_pulled = []

            # Pre-filter items for better performance
            three_star_items = list(banner.items.filter(rarity=3))
            four_star_items = list(banner.items.filter(rarity=4))
            five_star_items = list(banner.items.filter(rarity=5)) # Filter all items only once

            for _ in range(num_pulls):
                # Pity System
                if profile.pity_counter >= 90:
                    rarity = 5
                    profile.pity_counter = 0
                elif profile.pity_counter >= 74:
                    if profile.pity_counter < 80:
                        five_star_prob = 0.006 + (profile.pity_counter - 73) * 0.03
                    else:
                        five_star_prob = 0.33 + (profile.pity_counter - 80) * 0.03
                    four_star_prob = 0.051
                    rarity_probabilities = [1 - five_star_prob - four_star_prob, four_star_prob, five_star_prob]
                    rarity = random.choices([3, 4, 5], weights=rarity_probabilities, k=1)[0]
                else:
                    rarity_probabilities = [0.943, 0.051, 0.006]  # Normal probabilities
                    rarity = random.choices([3, 4, 5], weights=rarity_probabilities, k=1)[0]

                profile.pity_counter += 1
                profile.save()


                if rarity == 3:
                    items = three_star_items  # Use pre-filtered
                elif rarity == 4:
                    items = four_star_items  # Use pre-filtered
                elif rarity == 5:
                    items = five_star_items  # Use pre-filtered
                else:
                    items = [] # No appropriate banner selected

                if items:
                    random_item = random.choice(items)
                    items_pulled.append(random_item)
                    # ... (rest of inventory logic)
                else:
                    messages.error(request, f"No items found for rarity {rarity} in this banner. Please contact support.")  # Provide user feedback


            return render(request, 'lottery/pull.html', {'items': items_pulled, 'banner': banner}) # Include the pulled items
        else:
            messages.error(request, 'Not enough gems!')  # User feedback
            return render(request, 'lottery/pull.html', {'banner': banner})

    return render(request, 'lottery/pull.html', {'banner': banner})

@login_required
def inventory_view(request):
    inventory = UserInventory.objects.filter(user=request.user).select_related('item') # More efficient lookup
    return render(request, 'lottery/inventory.html', {'inventory': inventory})