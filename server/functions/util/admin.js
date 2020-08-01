const admin = require("firebase-admin");
const serviceAccount = require("./socialape-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialape-aa773.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin, db };
