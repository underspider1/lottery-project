import { getAuth, signOut } from "firebase/auth";

document.getElementById('logout-button').addEventListener('click', function() {
    const auth = getAuth();
    signOut(auth)
        .then(() => {
            
            console.log("User signed out");
            
            window.location.pathname = '/'; 
        })
        .catch((error) => {
            console.error("Sign-out error:", error);  
            
        });
});