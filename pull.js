const characters = ['Персонаж 1', 'Персонаж 2', 'Персонаж 3'];
const weapons = ['Оружие 1', 'Оружие 2', 'Оружие 3'];

document.getElementById('spin-button').addEventListener('click', function() {
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];

    const resultMessage = `Вы получили: ${randomCharacter} и ${randomWeapon}!`;
    document.getElementById('result').textContent = resultMessage;

    // Добавляем в локальное хранилище
    addToInventory(randomCharacter, randomWeapon);
});

function addToInventory(character, weapon) {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    inventory.push({ character, weapon });
    localStorage.setItem('inventory', JSON.stringify(inventory));
}
