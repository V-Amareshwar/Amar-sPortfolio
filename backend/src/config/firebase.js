const admin = require("firebase-admin");

// Initialize Firebase Admin SDK using environment variables
// These come from the Firebase service account JSON file
// The private key comes as a string from .env
let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";
// Remove enclosing quotes if any
privateKey = privateKey.replace(/^["']|["']$/g, "");
// Replace escaped newlines
privateKey = privateKey.replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

module.exports = { admin, db, auth, bucket };
