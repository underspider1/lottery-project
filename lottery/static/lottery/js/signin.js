import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent default form submission

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            console.log("User signed in:", userCredential.user);
            // Redirect, update UI, etc., based on successful login
            window.location.pathname = '/';

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            // Enhanced error handling – display errors next to the input fields:
            if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                document.getElementById('password-error').textContent = "Invalid email or password";
                document.getElementById('email-error').textContent = "Invalid email or password";

            } else if(errorCode === "auth/invalid-email"){
                document.getElementById('email-error').textContent = "Invalid email";

            }
            else{
                alert("Error:" + errorMessage);
            }

        });
});
