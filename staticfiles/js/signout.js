import { getAuth, signOut } from "firebase/auth";

document.getElementById('logout-button').addEventListener('click', function() {
    const auth = getAuth();
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.log("User signed out");
            // Redirect to home or login page after logout:
            window.location.href = '/'; // Or '/login/' or '{% url 'login' %}'
        })
        .catch((error) => {
            console.error("Sign-out error:", error);  // Log the error for debugging.
            // Display a user-friendly error message if necessary.
        });
});