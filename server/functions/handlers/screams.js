const { db } = require("../util/admin");

exports.getAllScreams = (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((docs) => {
      let screams = [];
      docs.forEach((doc) =>
        screams.push({
          screamId: doc.id,
          ...doc.data(),
        })
      );
      return res.json(screams);
    })
    .catch((err) => console.log(err));
};

exports.postOneScream = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ scream: "Must not be empty" });
  } else {
    const newScream = {
      body: req.body.body,
      handle: req.user.handle,
      userImage: req.user.imageUrl,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentCount: 0,
    };
    db.collection("screams")
      .add(newScream)
      .then((doc) => {
        const resScream = newScream;
        resScream.screamId = doc.id;
        res.json(resScream);
        console.log("Success");
      })
      .catch((err) => {
        res.status(500).json({ message: "Something went wrong" });
        console.log(err);
      });
  }
};

exports.getScream = (req, res) => {
  let screamDetails;
  db.doc(`screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ message: "Scream not found" });
      }
      screamDetails = doc.data();
      screamDetails.screamId = req.params.screamId;
      console.log(screamDetails);
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", req.params.screamId)
        .get();
    })
    .then((data) => {
      screamDetails.comments = [];
      data.forEach((doc) => {
        screamDetails.comments.push(doc.data());
      });
      return res.status(200).json(screamDetails);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};

exports.commentOnScream = (req, res) => {
  let screamId = req.params.screamId;

  if (req.body.body.trim() == "") {
    return res.status(400).json({ message: "Must not be empty" });
  }
  let comment = {
    screamId,
    handle: req.user.handle,
    body: req.body.body,
    imageUrl: req.user.imageUrl,
    createdAt: new Date().toISOString(),
  };

  db.doc(`/screams/${screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ message: "Scream not found" });
      }
      return db
        .collection("comments")
        .add(comment)
        .then((doc) => {
          return res.status(201).json(comment);
        })
        .then(() => {
          return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: err.code });
    });
};

exports.likeScream = (req, res) => {
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  const likesDocument = db
    .collection("likes")
    .where("handle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  screamDocument
    .get()
    .then((doc) => {
      // Check if the stream exist
      if (!doc.exists) {
        console.log(2);
        return res.status(404).json({ message: "Scream does not exist" });
      }

      return likesDocument.get().then((data) => {
        if (!data.empty) {
          return res.status(400).json({ message: "Scream already liked" });
        } else {
          const newLike = {
            handle: req.user.handle,
            screamId: req.params.screamId,
          };

          const screamData = doc.data();
          screamData.screamId = req.params.screamId;

          return db
            .collection("likes")
            .add(newLike)
            .then((doc) => {
              screamData.likesCount = screamData.likesCount + 1;
              return screamDocument.update({
                likesCount: screamData.likesCount,
              });
            })
            .then(() => {
              return res.json(screamData);
            });
        }
      });
    })
    .catch((err) => {
      console.log(1111);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeScream = (req, res) => {
  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  const likesDocument = db
    .collection("likes")
    .where("handle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  let screamData;

  screamDocument
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ message: "Scream does not exist" });
      }

      screamData = doc.data();
      screamData.screamId = req.params.screamId;

      return likesDocument.get().then((data) => {
        if (data.empty) {
          return res.status(400).json({ message: "Scream not liked" });
        } else {
          return db
            .doc(`/likes/${data.docs[0].id}`)
            .delete()
            .then(() => {
              screamData.likesCount--;
              return screamDocument.update({
                likesCount: screamData.likesCount,
              });
            })
            .then(() => {
              return res.status(201).json(screamData);
            });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ message: "Scream Not Found" });
      }
      if (doc.data().handle !== req.user.handle) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      return document.delete().then(() => {
        return res.json("Scream deleted ");
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};
