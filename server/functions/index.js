const functions = require("firebase-functions");
const express = require("express");
const { db } = require("./util/admin");
const cors = require("cors");

const app = express();
app.use(cors());
// // Create and Deploy Your First Cloud Functions

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
} = require("./handlers/screams");
const {
  login,
  signup,
  imageUpload,
  addUserDetails,
  getAuthenticatedUser,
  getUser,
  markNotificationRead,
} = require("./handlers/users");
const FBauth = require("./util/fbAuth");

// Scream routes
app.get("/screams", getAllScreams);
app.post("/scream", FBauth, postOneScream);
app.get("/scream/:screamId", getScream);
// TODO: Delete a scream
app.delete("/scream/:screamId", FBauth, deleteScream);
// TODO: Like a scream
app.get("/scream/:screamId/like", FBauth, likeScream);
// TODO: Unlike a scream
app.get("/scream/:screamId/unlike", FBauth, unlikeScream);
// TODO: comment on scream
app.post("/scream/:screamId/comment", FBauth, commentOnScream);

// User routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBauth, imageUpload);
app.post("/user", FBauth, addUserDetails);
app.get("/user", FBauth, getAuthenticatedUser);
app.get("/user/:handle", getUser);
app.post("/notification", FBauth, markNotificationRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document(`likes/{id}`)
  .onCreate((snapshot) => {
    console.log("Like Notification");
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists && snapshot.data().handle !== doc.data().handle) {
          console.log("1. Scream Exists..");
          return db.doc(`/notifications/${snapshot.id}`).set({
            recepient: doc.data().handle,
            sender: snapshot.data().handle,
            createdAt: new Date().toISOString(),
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document(`likes/{id}`)
  .onDelete((snapshot) => {
    console.log("UNLike Notification");
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.log(err);
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document(`comments/{id}`)
  .onCreate((snapshot) => {
    console.log("Comment Notification");
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists && snapshot.data().handle !== doc.data().handle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recepient: doc.data().handle,
            sender: snapshot.data().handle,
            createdAt: new Date().toISOString(),
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

// Update image is user changes it in screams and comments
exports.onUserImageChange = functions.firestore
  .document(`/users/{handle}`)
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());

    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      let batch = db.batch();
      return db
        .collection(`screams`)
        .where("handle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`screams/${doc.id}`);
            batch.update(scream, { imageUrl: change.after.data().imageUrl });
          });
          return db
            .collection("comments")
            .where("handle", "==", change.before.data().handle)
            .get();
        })
        .then((data) => {
          // Change image in comments
          data.forEach((doc) => {
            const comment = db.doc(`comments/${doc.id}`);
            batch.update(comment, { imageUrl: change.after.data().imageUrl });
          });
          return batch.commit();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

// Delete all likes and comments when a scream is deleted
exports.onScreamDelete = functions.firestore
  .document(`/screams/{screamId}`)
  .onDelete((snapshot, context) => {
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", context.params.screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("screamId", "==", context.params.screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", context.params.screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.log(err);
      });
  });
