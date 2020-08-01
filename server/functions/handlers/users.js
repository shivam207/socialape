const { admin, db } = require("../util/admin");
const config = require("../util/config");

const firebase = require("firebase");
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require("../util/validators");
const { fileURLToPath } = require("url");

const signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  //TODO: Validate User
  // Check for empty email and handle
  // Check for empty handle
  // Check password == confirmPassword
  const { valid, errors } = validateSignupData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }

  let token, userId;
  let noImg = "no-img.png";
  db.doc(`users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(500).json({ handle: "This handle already exists." });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idtoken) => {
      // Add New User Created in database collection users
      token = idtoken;
      const userCredentials = {
        handle: newUser.handle,
        userId,
        email: newUser.email,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        createdAt: new Date().toISOString(),
      };
      return db.doc(`users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      if (err.code == "auth/email-already-in-use") {
        return res.status(400).json({ email: "This email is already in use" });
      } else {
        res.status(500).json({ error: err.code });
      }
    });
};

const login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.status(200).json({ token });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(403)
        .json({ general: "Wrong Credentials, Please try again" });
    });
};

const addUserDetails = (req, res) => {
  // Add Bio, website and location details
  var userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.status(201).json({ message: "Details added successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

const imageUpload = (req, res) => {
  var Busboy = require("busboy");
  var path = require("path");
  var os = require("os");
  var fs = require("fs");

  var busboy = new Busboy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded;
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    console.log("File event");

    if (mimetype != "image/jpeg" && mimetype != "image/png")
      return res
        .status(400)
        .json({ message: "Please upload a jpeg/png image." });

    // my.image.png
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    //34349395449320.png
    imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    // Create file in tmp directory using fs library
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", function () {
    // When the file is created in tmp directory, upload it to bucket
    admin
      .storage()
      .bucket(config.storageBucket)
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.status(201).json({ message: "Image Uploaded successfully" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

const getAuthenticatedUser = (req, res) => {
  let userDetails = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userDetails.credentials = doc.data();
        return db
          .collection("likes")
          .where("handle", "==", req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userDetails.likes = [];
      data.forEach((doc) => {
        userDetails.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recepient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      userDetails.notifications = [];
      data.forEach((doc) => {
        userDetails.notifications.push({
          ...doc.data(),
          notificationId: doc.id,
        });
      });
      return res.status(200).json(userDetails);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

const getUser = (req, res) => {
  let userDetails = {};
  db.doc(`users/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userDetails.user = doc.data();
        return db
          .collection("screams")
          .where("handle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    })
    .then((data) => {
      userDetails.screams = [];
      data.forEach((scream) => {
        userDetails.screams.push({
          ...scream.data(),
          screamId: scream.id,
        });
      });
      console.log(userDetails);
      return res.status(200).json(userDetails);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

const markNotificationRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    let notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.status(201).json({ message: "Notifications Marked Read" });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};
module.exports = {
  signup,
  login,
  imageUpload,
  addUserDetails,
  getAuthenticatedUser,
  getUser,
  markNotificationRead,
};
