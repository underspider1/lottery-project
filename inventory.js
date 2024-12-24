
window.onload = function() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const inventoryList = document.getElementById('inventory-list');

    inventory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.character} и ${item.weapon}`;
        inventoryList.appendChild(listItem);
    });
}