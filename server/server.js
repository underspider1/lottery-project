require('dotenv').config();
const admin = require('firebase-admin');
const express = require('express');
const rateLimit = require('express-rate-limit');
const serviceAccount = require('./lottery-159de-firebase-adminsdk-y7ch8-8f429acc76.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lottery-159de-default-rtdb.firebaseio.com"
});

const express = require('express');
const app = express();
app.use(express.json()); // Important: To parse JSON request bodies

const createUserLimiter = rateLimit({
  windowMs: 60 * 1000,  
  max: 10,               
  message: { error: "Too many create user requests. Please try again later." }, // JSON error response
  handler: (req, res, next, options) => { // Custom handler to respond with JSON
    res.status(options.statusCode).json(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const customTokenLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many token requests, please try again later."}
})

async function createCustomToken(uid) {
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    return customToken;
  } catch (error) {
    console.error("Error creating custom token:", error);
    throw error; // Re-throw for proper error handling in the route handler
  }
}

// Example route handler to create a new user and return a custom token
app.post('/createUser', createUserLimiter, async (req, res) => {
  try {
    const { email, password } = req.body; // Get user credentials from request (validate this data thoroughly!)

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const customToken = await createCustomToken(userRecord.uid); // Use the automatically generated UID

    res.status(201).json({ uid: userRecord.uid, token: customToken });
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging
    // Send appropriate error response to client based on error type (e.g., email already in use)
    res.status(500).json({ error: "Failed to create user" }); // Generic error response for now
  }
});

// Route to get a custom token for an existing user (important for refreshing tokens)
app.post('/getCustomToken', customTokenLimiter, async (req, res) => {
  try {
    const { uid } = req.body;  // Get the user's UID from the request body

    // Important: In a real application, verify that the client is authorized to request a token for this UID.
    const customToken = await createCustomToken(uid);
    res.status(200).json({ token: customToken });
  } catch (error) {
    console.error("Error getting custom token:", error);
    res.status(500).json({ error: "Failed to get custom token" });
  }
});



// ... your other server-side logic

const port = process.env.PORT || 3000; // Use environment variables for port, etc.
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});