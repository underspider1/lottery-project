import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;


    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in successfully - you might want to redirect or update the UI here.
            console.log("User registered:", userCredential.user); // For debugging
            // Example redirect:
            // window.location.href = '/profile'; // Redirect to a profile page after registration.

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // Display error message next to the relevant field
            // ... (Your error handling code from the previous response is correct and can stay here)
        });
});
