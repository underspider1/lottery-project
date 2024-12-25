const banners = { // Updated banners with 4-star characters
    1: {
        characters5: ['Yoimiya', 'Tartaglia'],
        weapons5: [], // No 5-star weapons on this banner
        characters4: ['Faruzan', 'Collei', 'Yun Jin', 'Kuki Shinobu', 'Heizou', 'Gorou', 'Dori', 'Candace', 'Layla', 'Sayu', 'Yaoyao', 'Mika', 'Kaveh', 'Kirara', 'Freminet', 'Lynette', 'Chevreuse', 'Charlotte', 'Gaming', 'Sethos', 'Xingqiu', 'Sucrose', 'Noelle', 'Chongyun', 'Beidou', 'Fischl', 'Bennett', 'Razor', 'Barbara', 'Diona', 'Xinyan', 'Rosaria', 'Yanfei', 'Sara', 'Ororon', 'Kachina']
    },
    2: {
        characters5: [], // No 5-star characters on this banner
        weapons5: ['Thundering Pulse', 'Polar Star'],
        characters4: ['Faruzan', 'Collei', 'Yun Jin', 'Kuki Shinobu', 'Heizou', 'Gorou', 'Dori', 'Candace', 'Layla', 'Sayu', 'Yaoyao', 'Mika', 'Kaveh', 'Kirara', 'Freminet', 'Lynette', 'Chevreuse', 'Charlotte', 'Gaming', 'Sethos', 'Xingqiu', 'Sucrose', 'Noelle', 'Chongyun', 'Beidou', 'Fischl', 'Bennett', 'Razor', 'Barbara', 'Diona', 'Xinyan', 'Rosaria', 'Yanfei', 'Sara', 'Ororon', 'Kachina']
    },
    3: {
        characters5: ['Dehya', 'Diluc', 'Mona', 'Jean', 'Tighnary', 'Qiqi', 'Keqing'],
        weapons5: ['Skyward Atlas', 'Skyward Spine', 'Skyward Pride', 'Skyward Blade', 'Amos\' Bow', 'Lost Prayer to the Sacred Winds', 'Primordial Jade Winged-Spear', 'Wolf\'s Gravestone', 'Aquila Favonia', 'Skyward Harp'],
        characters4: ['Faruzan', 'Collei', 'Yun Jin', 'Kuki Shinobu', 'Heizou', 'Gorou', 'Dori', 'Candace', 'Layla', 'Sayu', 'Yaoyao', 'Mika', 'Kaveh', 'Kirara', 'Freminet', 'Lynette', 'Chevreuse', 'Charlotte', 'Gaming', 'Sethos', 'Xingqiu', 'Sucrose', 'Noelle', 'Chongyun', 'Beidou', 'Fischl', 'Bennett', 'Razor', 'Barbara', 'Diona', 'Xinyan', 'Rosaria', 'Yanfei', 'Sara', 'Ororon', 'Kachina']
    },
};

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

function addToInventory(character, weapon, bannerId, rarity) {
    try {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || {};
        if (!inventory[bannerId]) {
            inventory[bannerId] = [];
        }
        inventory[bannerId].push({ character, weapon, rarity });
        localStorage.setItem('inventory', JSON.stringify(inventory));
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