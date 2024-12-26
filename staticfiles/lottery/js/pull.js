import banners from './banners.js';

// Get the pull URL *from the template* (this is crucial):
const pullUrl = document.getElementById('pull-form').action;  // Correct way to get form action URL. It should be provided in 'action' argument of <form> tag

// Add event listener to the form itself, for submissions:
document.getElementById('pull-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission, so it won't make the default POST request

    const formData = new FormData(event.target);  // Correct FormData object
    
    try {
        const response = await fetch(pullUrl, {  // Use pullUrl from the template for the request
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken  // Correct CSRF token usage
            },
            body: formData  // Send FormData
        });

        if (!response.ok) {
            const data = await response.json(); 
            throw new Error(data.error || 'Server Error'); // Throw error to be caught by catch
        }

        const data = await response.json();
        console.log("Data from server:", data); // Debugging log

        // Pity and Guarantee Logic (corrected and simplified)
        let pity = parseInt(localStorage.getItem(`pity-${bannerId}`)) || 0; //Default 0 for new banner_ids
        let guaranteed5Star = localStorage.getItem(`guaranteed5Star-${bannerId}`) === 'true' || false; // Get current guaranteed status, if available. Default: false


        if (data.rarity === 5 || guaranteed5Star) {
            pity = 0;
            guaranteed5Star = false;
        } else {
            pity++;
            if (pity >= 90) { //Correct condition. After 90 pulls - guaranteed 5*
                guaranteed5Star = true;
            }
        }


        localStorage.setItem(`pity-${bannerId}`, pity);
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
        console.error("Fetch error:", error);
        document.getElementById('result').textContent = 'An error occurred during the pull. Please try again later.';
        // ... other error handling ...
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