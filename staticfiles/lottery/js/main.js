import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import * as firebaseui from 'firebaseui';



const ui = new firebaseui.auth.AuthUI(getAuth());

const userSpecificPullButton = document.getElementById('user-pull-button');
if (userSpecificPullButton) {  
    const bannerId = userSpecificPullButton.dataset.bannerId;
    userSpecificPullButton.addEventListener('click', () => {
        window.location.href = `/pull/${bannerId}/`;
    });
}

const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            return true; 
        },
        uiShown: function () {
            
        }
    },
    signInFlow: 'popup',
    signInOptions: [
        firebaseui.auth.EmailAuthProvider.PROVIDER_ID, 
        
    ],

   

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



     

    } else {
   

        let firebaseUiContainer = document.getElementById('firebaseui-auth-container');
        if (!firebaseUiContainer) {
            firebaseUiContainer = document.createElement('div');
            firebaseUiContainer.id = 'firebaseui-auth-container';
            document.body.appendChild(firebaseUiContainer);
        }

      
        ui.start('#firebaseui-auth-container', uiConfig);

    }
});