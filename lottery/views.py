from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Banner, Item, UserInventory, Profile
import random
from django.contrib import messages

first_banner = Banner.objects.filter(is_active=True).order_by('id').first()
    if first_banner:
        return redirect('pull', banner_id=first_banner.pk)  # Redirect to the first banner's pull view
    else:
        # Handle the case where there are no active banners – display a message, render a different template, etc.
        return render(request, 'lottery/no_banners.html')  # Or similar

@login_required
def pull_view(request, banner_id):
    banner = get_object_or_404(Banner, pk=banner_id)
    profile = request.user.profile

    if request.method == 'POST':
        pull_type = request.POST.get('pull_type') # Assuming 'single' or 'ten' from your form
        cost = 160 if pull_type == 'single' else 1600

        if profile.balance >= cost:
            profile.balance -= cost
            profile.save()

            num_pulls = 1 if pull_type == 'single' else 10
            items_pulled = []

            for _ in range(num_pulls):
                pulled_item = perform_pull(profile, banner)
                if pulled_item:
                    items_pulled.append(pulled_item)
                    # ... (add to inventory logic as before)

            return render(request, 'lottery/pull.html', {'items': items_pulled, 'banner': banner})
        else:
            messages.error(request, 'Not enough gems!')
            return render(request, 'lottery/pull.html', {'banner': banner})  # Return to pull page with error

    return render(request, 'lottery/pull.html', {'banner': banner})  # Initial GET request

def perform_pull(profile, banner): #Helper function for a single pull
    if profile.pity_counter >= 90:
        rarity = 5
        profile.pity_counter = 0  # Reset pity
    elif profile.pity_counter >= 74:
        five_star_prob = 0.006 + (profile.pity_counter - 73) * 0.06  # Increased probability
        four_star_prob = 0.051
        rarity_probabilities = [1 - five_star_prob - four_star_prob, four_star_prob, five_star_prob]
        rarity = random.choices([3, 4, 5], weights=rarity_probabilities, k=1)[0]
    else:
        rarity_probabilities = [0.943, 0.051, 0.006]
        rarity = random.choices([3, 4, 5], weights=rarity_probabilities, k=1)[0]

    profile.pity_counter += 1
    profile.save()

    try:
        if rarity == 3:
            item = random.choice(banner.items.filter(rarity=3))
        elif rarity == 4:
            item = random.choice(banner.items.filter(rarity=4))
        elif rarity == 5:
            item = random.choice(banner.items.filter(rarity=5))
        else:
            return None # Should not happen, but handle it just in case

        return item
    except IndexError: # Handle potential error when no item exists for chosen rarity
        return None



@login_required
def inventory_view(request):
    inventory = UserInventory.objects.filter(user=request.user).select_related('item')
    return render(request, 'lottery/inventory.html', {'inventory': inventory})