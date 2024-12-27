import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent default form submission

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
           
            console.log("User signed in:", userCredential.user);
           
            window.location.pathname = '/';

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

           
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
