import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import * as firebaseui from 'firebaseui';


// Initialize FirebaseUI Auth
// This initialization can remain outside the onAuthStateChanged callback.
const ui = new firebaseui.auth.AuthUI(getAuth());

const userSpecificPullButton = document.getElementById('user-pull-button');
if (userSpecificPullButton) {  // Add this check to avoid errors
    const bannerId = userSpecificPullButton.dataset.bannerId;
    userSpecificPullButton.addEventListener('click', () => {
        window.location.href = `/pull/${bannerId}/`;  // Add the trailing slash
    });
}

const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            return true; // Continue to the redirect (handled in onAuthStateChanged)
        },
        uiShown: function () {
            // Hide any loader you might be using
        }
    },
    signInFlow: 'popup', // Use popup for sign-in
    signInOptions: [
        firebaseui.auth.EmailAuthProvider.PROVIDER_ID, // Include Email/Password provider
        // Add other providers as needed (Google, Facebook, etc.)
    ],

    // ... other UI config options (tosUrl, privacyPolicyUrl, etc.)

};

const auth = getAuth();

onAuthStateChanged(getAuth(), (user) => {
    const authFormContainer = document.getElementById('auth-form-container');
    if (user) {
        if (window.location.pathname === '/login' || window.location.pathname === '/register') { // Check if redirected from login page
            window.location.pathname = '/'; // Redirect logged-in user away from login page
        }
        // User is signed in, hide FirebaseUI container (if it exists)
        const firebaseUiContainer = document.getElementById('firebaseui-auth-container');
        

        if (firebaseUiContainer) {
            firebaseUiContainer.style.display = 'none';
        }



        // ... rest of the signed-in user logic (add logout button, etc.)

    } else {
        // No user is signed in.  Render the FirebaseUI widget

        let firebaseUiContainer = document.getElementById('firebaseui-auth-container');
        if (!firebaseUiContainer) {
            firebaseUiContainer = document.createElement('div');
            firebaseUiContainer.id = 'firebaseui-auth-container';
            document.body.appendChild(firebaseUiContainer);
        }

        // Now, start FirebaseUI targeting the container
        ui.start('#firebaseui-auth-container', uiConfig);  // MUST be called when no user

    }
});