import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

document.getElementById('register-form').addEventListener('submit', function(event) {
    
    event.preventDefault(); 

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;


    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
       
            console.log("User registered:", userCredential.user); // For debugging
    
            window.location.pathname = '/';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            
        });
});
