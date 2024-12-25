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

document.getElementById('spin-button').addEventListener('click', function() {
    const bannerId = document.getElementById('banner-select').value;
    const banner = banners[bannerId];
    let pity = parseInt(localStorage.getItem(`pity-${bannerId}`)) || 0;
    let guaranteed5Star = localStorage.getItem(`guaranteed5Star-${bannerId}`) === 'true' || false;

    let randNum = Math.random();
    let is5Star = (pity >= 90) || (pity >= 74 && randNum <= 0.66) || (pity < 74 && randNum <= 0.006);

    let pulledCharacter, pulledWeapon;
    if (is5Star) {
        if (banner.characters5.length > 0 && banner.weapons5.length > 0){
            if (Math.random() < 0.5) { // 50% chance for weapon or character.
                pulledCharacter = banner.characters5[Math.floor(Math.random() * banner.characters5.length)];
                pulledWeapon = null;
            } else {
                pulledWeapon = banner.weapons5[Math.floor(Math.random() * banner.weapons5.length)];
                pulledCharacter = null;
            }
        }
        else if(banner.characters5.length > 0)
        {
            pulledCharacter = banner.characters5[Math.floor(Math.random() * banner.characters5.length)];
            pulledWeapon = null; // No weapon on this banner
        }
        else {
            pulledWeapon = banner.weapons5[Math.floor(Math.random() * banner.weapons5.length)];
            pulledCharacter = null; // No character on this banner
        }
        pity = 0; // Reset pity
        guaranteed5Star = false;
    } else {
        pity++;
        pulledCharacter = banner.characters4[Math.floor(Math.random() * banner.characters4.length)]; // 4-star character
        pulledWeapon = null; // No weapon

        if (pity === 90 && !guaranteed5Star) {
            guaranteed5Star = true;
        }
    }

    localStorage.setItem(`pity-${bannerId}`, pity);
    localStorage.setItem(`guaranteed5Star-${bannerId}`, guaranteed5Star);

    let resultMessage = '';
    if (pulledCharacter) {
        resultMessage += `You pulled character: ${pulledCharacter}! `;
    }
    if (pulledWeapon) {
        resultMessage += `You pulled weapon: ${pulledWeapon}! `;
    }
    resultMessage += `Is 5 star: ${is5Star}, Pity: ${pity}, Guaranteed 5 star: ${guaranteed5Star}`;

    document.getElementById('result').textContent = resultMessage;

    addToInventory(pulledCharacter, pulledWeapon, bannerId);
});




function addToInventory(character, weapon, bannerId) {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || {};
    if (!inventory[bannerId]) {
        inventory[bannerId] = [];
    }
    inventory[bannerId].push({ character, weapon });
    localStorage.setItem('inventory', JSON.stringify(inventory));
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