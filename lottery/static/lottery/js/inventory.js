import banners from './banners.js';

function updateInventoryList(bannerId) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const inventoryList = document.getElementById('inventory-list');
}

window.onload = function() {
    for(const bannerId in banners){
        updateInventoryList(bannerId)
}
    inventory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.character} и ${item.weapon}`;
        inventoryList.appendChild(listItem);
    });
}