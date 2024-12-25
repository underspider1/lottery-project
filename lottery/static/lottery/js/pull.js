import banners from './banners.js';

document.getElementById('spin-button').addEventListener('click', async function () {
    const bannerId = document.getElementById('banner-select').value;
    const banner = banners[bannerId];
    const url = this.dataset.url;


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'X-CSRFToken': csrftoken }
        });
        if (!response.ok) {
            const data = await response.json(); // Get error from Django, if any
            throw new Error(data.error || 'Server Error');
        }

        const data = await response.json();

        let pity = parseInt(localStorage.getItem(`pity-${bannerId}`)) || 0;
        let guaranteed5Star = localStorage.getItem(`guaranteed5Star-${bannerId}`) === 'true' || false;

        if (data.rarity === 5 || guaranteed5Star) {
            pity = 0;
            guaranteed5Star = false;
        } else {
            pity++;
            if (pity === 90) {
                guaranteed5Star = true;
            }
        }

        localStorage.setItem(`pity-${bannerId}`, pity); // Update local pity
        localStorage.setItem(`guaranteed5Star-${bannerId}`, guaranteed5Star); // Update local guarantee
        
        let resultMessage = '';
        if (data.name) {
            resultMessage += `You pulled: ${data.name}! `;
        }
        if (data.image_url) {
            resultMessage += `<img src="${data.image_url}" alt="${data.name}" width="100">`; // Or however you want to display the image
        }
        resultMessage += `<br>Rarity: ${data.rarity}, Pity: ${pity}, Guaranteed 5-star: ${guaranteed5Star}`; // Correctly use pity after it has been updated
        document.getElementById('result').innerHTML = resultMessage; // Update the HTML

        addToInventory(data.name, data.image_url, bannerId, data.rarity); // Update inventory.


        document.getElementById('gems').textContent = parseInt(document.getElementById('gems').textContent) - 160; // Deduct gems if successful

    } catch (error) {
        // ... (error handling remains the same)
    }
});

function updateInventoryList(bannerId){ // Function to update the list. Add this function to pull.js
    const inventoryList = document.getElementById(`inventory-list-${bannerId}`); // Use banner specific id
    if(!inventoryList) return; // Doesn't exist
    inventoryList.innerHTML = ''; // Clear list first
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {};
    if(inventory[bannerId]){
        inventory[bannerId].forEach(item => {
            const listItem = document.createElement('li');
            if(item.image_url)
                listItem.innerHTML = `<img src="${item.image_url}" alt="${item.character || item.weapon}" width="50"> ${item.character || item.weapon} (Rarity: ${item.rarity})`;
            else
                listItem.textContent = `${item.character || item.weapon} (Rarity: ${item.rarity})`;
            inventoryList.appendChild(listItem);
        });
    }
}

function addToInventory(character, weapon, bannerId, rarity) {
    try {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || {};
        if (!inventory[bannerId]) {
            inventory[bannerId] = [];
        }
        inventory[bannerId].push({ character, weapon, rarity });
        localStorage.setItem('inventory', JSON.stringify(inventory));
        updateInventoryList(bannerId);
    } catch (error) { // The catch block is now *inside* the function
        console.error("Error updating inventory:", error);
        document.getElementById('result').textContent = 'An error occurred while updating your inventory. Please try again later or contact support if this issue persists.';
        // Consider displaying a message to the user.
    }
}

// Banner Selection (remains the same)
const bannerSelect = document.createElement('select');
bannerSelect.id = 'banner-select';
for (const id in banners) {
    const option = document.createElement('option');
    option.value = id;
    option.text = `Banner ${id}`;
    bannerSelect.appendChild(option);
}

document.body.insertBefore(bannerSelect, document.getElementById('spin-button'));