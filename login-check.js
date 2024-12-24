firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Пользователь вошел
        console.log("Пользователь:", user.email);
    } else {
        // Пользователь вышел
        console.log("Нет пользователя, доступ запрещен.");
    }
});