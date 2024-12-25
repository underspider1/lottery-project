from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from lottery.models import Banner, Item, UserInventory, Profile
import random
from django.contrib import messages

# Constants for banner types
LIMITED_CHARACTER_BANNER_1 = 1
LIMITED_CHARACTER_BANNER_2 = 2
LIMITED_WEAPON_BANNER = 3
STANDARD_BANNER = 4

# Cache the standard banner instance *outside* the view functions
STANDARD_BANNER = Banner.objects.get(name="Standard")


def home_view(request):
    first_banner = Banner.objects.filter(is_active=True).order_by('id').first()
    if first_banner:
        return redirect('pull', banner_id=first_banner.pk)
    else:
        return render(request, 'lottery/no_banners.html')


@login_required
def pull_view(request, banner_id):
    banner = get_object_or_404(Banner, pk=banner_id)
    profile = request.user.profile

    if request.method == 'POST':
        pull_type = request.POST.get('pull_type')
        cost = 160 if pull_type == 'single' else 1600

        if profile.balance >= cost:
            profile.balance -= cost
            profile.save()  # Save balance changes immediately

            num_pulls = 1 if pull_type == 'single' else 10
            pulled_items = []
            for _ in range(num_pulls):
                pulled_item = perform_pull(profile, banner, banner_id)
                if pulled_item:
                    pulled_items.append(pulled_item)
                    try:  # Handle potential errors during inventory update
                        inventory_item, created = UserInventory.objects.get_or_create(user=request.user, item=pulled_item)
                        inventory_item.quantity += 1
                        inventory_item.save()
                    except Exception as e:
                        print(f"Error updating inventory: {e}")  # Log the error properly
                        return JsonResponse({'error': 'Inventory update failed'}, status=500)

            serialized_items = [{'name': item.name, 'image_url': item.image.url if item.image else None, 'rarity': item.rarity} for item in pulled_items]

            response_data = {  # Include updated balance and pity information
                'items': serialized_items,
                'pity_counter': profile.character_pity_counter if banner_id == LIMITED_CHARACTER_BANNER_1 or banner_id == LIMITED_CHARACTER_BANNER_2 else profile.weapon_pity_counter if banner_id == LIMITED_WEAPON_BANNER else profile.standard_pity_counter,
                'guaranteed_4star_or_above': profile.guaranteed_4star_or_above,
                'guaranteed_featured_4star': profile.guaranteed_featured_4star,
                'guaranteed_featured_5star': profile.guaranteed_featured_5star_character if banner_id == LIMITED_CHARACTER_BANNER_1 or banner_id == LIMITED_CHARACTER_BANNER_2 else profile.guaranteed_featured_5star_weapon if banner_id == LIMITED_WEAPON_BANNER else False,
                'balance': profile.balance,  # Updated balance

            }
            return JsonResponse(response_data)
        else: # Handle not enough balance case.
            messages.error(request, 'Not enough gems!')
            return JsonResponse({'error': 'Not enough gems'}, status=402)  # Payment Required

    return render(request, 'lottery/pull.html', {'banner': banner})


def perform_pull(profile, banner, banner_id):
    # Determine pity_counter, guaranteed_featured_5star, soft_pity, hard_pity
    if banner_id == LIMITED_CHARACTER_BANNER_1 or banner_id == LIMITED_CHARACTER_BANNER_2:
        pity_counter = profile.character_pity_counter
        guaranteed_featured_5star = profile.guaranteed_featured_5star_character
        soft_pity = 74
        hard_pity = 90
    elif banner_id == LIMITED_WEAPON_BANNER:
        pity_counter = profile.weapon_pity_counter
        guaranteed_featured_5star = profile.guaranteed_featured_5star_weapon
        soft_pity = 64
        hard_pity = 80
    elif banner_id == STANDARD_BANNER: # Correct placement
        pity_counter = profile.standard_pity_counter
        guaranteed_featured_5star = False
        soft_pity = 74
        hard_pity = 90
    else:
        return None  # Or raise an exception
    
    guaranteed_4star_or_above = profile.guaranteed_4star_or_above
    guaranteed_featured_4star = profile.guaranteed_featured_4star
    
    # ... determine rarity
    if pity_counter >= hard_pity:    
        rarity = 5
    elif pity_counter >= soft_pity:
        five_star_prob = 0.006 + (pity_counter - (soft_pity-1)) * 0.06  # Increased probability during soft pity
        if random.random() < five_star_prob:
            rarity = 5
        elif random.random() < 0.057:  # Probability for 4-star (adjust as needed)
            rarity = 4
        else:
            rarity = 3  # Covers the rest of probability
    elif guaranteed_4star_or_above:
        if random.random() < 0.06:
            rarity = 5
        else:
            rarity = 4  # Guaranteed 4-star or above (but not 3-star)
    else: # Regular probabilities
        if random.random() < 0.006:
            rarity = 5
        elif random.random() < 0.057:  # Regular 4-star probability
            rarity = 4
        else:
            rarity = 3
            
    try:
        if rarity == 5:

            if banner_id == STANDARD_BANNER: # Correct placement. If banner is standard, use items from standard banner
                item = random.choice(STANDARD_BANNER.items.filter(rarity=5)) # Use cached banner instance.
            elif random.random() < 0.5 or guaranteed_featured_5star:
                try:
                    item = random.choice(banner.items.filter(rarity=5, is_featured=True))
                except IndexError:
                    item = random.choice(STANDARD_BANNER.items.filter(rarity=5)) # Use the cached banner.
                guaranteed_featured_5star = False
            else:
                item = random.choice(STANDARD_BANNER.items.filter(rarity=5)) # Use cached banner.
                guaranteed_featured_5star = True

            # Reset pity after selecting an item.
            if banner_id == LIMITED_CHARACTER_BANNER_1 or banner_id == LIMITED_CHARACTER_BANNER_2:
                profile.character_pity_counter = 0
            elif banner_id == LIMITED_WEAPON_BANNER:
                profile.weapon_pity_counter = 0
            elif banner_id == STANDARD_BANNER: #Update standard banner pity as well.
                profile.standard_pity_counter = 0
        elif rarity == 4:
            if random.random() < 0.5 or guaranteed_featured_4star:
                try:
                    item = random.choice(banner.items.filter(rarity=4, is_promoted=True))
                except IndexError:  # No promoted 4-star items in this banner
                    item = random.choice(banner.items.filter(rarity=4))  # Correct: choose any 4*
                guaranteed_featured_4star = False  # Correct placement: reset AFTER pulling the item

            else:  # Lost 50/50 for a 4*
                try:
                    item = random.choice(banner.items.filter(rarity=4, is_promoted=False)) # Choose non-promoted
                except IndexError:  # Handle missing items
                    item = random.choice(banner.items.filter(rarity=4)) # Fallback if no non-promoted items
                guaranteed_featured_4star = True  # Guarantee next 4* is featured

        elif rarity == 3:
            item = random.choice(banner.items.filter(rarity=3))
        else:
            return None


        if guaranteed_4star_or_above > 0:  #Check if guarantee is active
            if rarity == 4 or rarity == 5:  # Correct condition: reset only if 4* or 5* is pulled
                guaranteed_4star_or_above = 0  # Correct logic and placement.
        elif guaranteed_4star_or_above == 9 and rarity == 3:  # Correct condition and placement. Guaranteed 4* or 5* on the next pull
            guaranteed_4star_or_above = 0 # Reset the counter, next will be guaranteed 4* or 5*
            if random.random() < 0.06:  # 6% for 5-star. No soft pity here.
                rarity = 5
                # ... (same logic as in rarity == 5 block, including pity reset)
            else:  # Guaranteed 4-star since 5* wasn't pulled and guaranteed_4star_or_above was 9.
                rarity = 4
                if random.random() < 0.5 or guaranteed_featured_4star: #Handle 50/50 for featured 4*
                    try:  #Featured 4*
                        item = random.choice(banner.items.filter(rarity=4, is_promoted=True))
                    except IndexError: # No promoted 4 stars in this banner
                        item = random.choice(banner.items.filter(rarity=4))
                    guaranteed_featured_4star = False
                else: #Lost 50/50
                    try:
                        item = random.choice(banner.items.filter(rarity=4, is_promoted=False))
                    except IndexError:
                        item = random.choice(banner.items.filter(rarity=4))
                    guaranteed_featured_4star = True
        #Correct placement. Increment pity only after checking if 4* is guaranteed, and if no 4* or above items were pulled.
        elif guaranteed_4star_or_above < 9 and rarity == 3:  #Correct condition: if guaranteed_4star_or_above < 9 (thus not guaranteed 4* on next pull) and 3* is pulled - increment pity
            guaranteed_4star_or_above += 1



        if rarity != 5:  #Correct indentation and placement. Update pity AFTER guaranteed_4star_or_above is handled.
            if banner_id == LIMITED_CHARACTER_BANNER_1 or banner_id == LIMITED_CHARACTER_BANNER_2:
                profile.character_pity_counter += 1
            elif banner_id == LIMITED_WEAPON_BANNER:
                profile.weapon_pity_counter += 1
            elif banner_id == STANDARD_BANNER:
                profile.standard_pity_counter += 1

        # Update guarantees AFTER item selection, pity updates, and guaranteed_4star_or_above logic.
        profile.guaranteed_featured_4star = guaranteed_featured_4star  # Correct placement
        profile.guaranteed_4star_or_above = guaranteed_4star_or_above  # Correct placement and update logic


    except IndexError as e:
        # ... existing error handling ...
        return None

    # ... (previous code)
    if banner_id == LIMITED_CHARACTER_BANNER_1 or banner_id == LIMITED_CHARACTER_BANNER_2:
        profile.guaranteed_featured_5star_character = guaranteed_featured_5star
    elif banner_id == LIMITED_WEAPON_BANNER:
        profile.guaranteed_featured_5star_weapon = guaranteed_featured_5star

    profile.save()
    return item  # Correct indentation (should be outside the if block)





@login_required
def inventory_view(request):
    inventory = UserInventory.objects.filter(user=request.user).select_related('item')
    return render(request, 'lottery/inventory.html', {'inventory': inventory})