const { db } = require("../util/admin");

exports.getAllScreams = (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userhandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount : doc.data().commentCount,
          likeCount : doc.data().likeCount,
          userImage: doc.data().userImage
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
};
exports.postOneScream = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newScream = {
    body: req.body.body,
    userImage: req.user.imageUrl,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("screams")
    .add(newScream)
    .then((doc) => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      return res.json(resScream);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.log(err);
    });
};
exports.getScream = (req, res) => {
  let screamData = {};
  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "scream not found" });
      }

      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")

        .where("screamId", "==", req.params.screamId)
        .get();
    })
    .then((data) => {
      screamData.comments = [];
      data.forEach((doc) => {
        screamData.comments.push(doc.data());
      });
      return res.json(screamData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
exports.commentOnScream = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment : "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      return res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};
exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userhandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData = {};

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Scream not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            screamId: req.params.screamId,
            userHandle: req.user.handle,
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(screamData);
          });
      } else {
        return res.status(400).json({ error: "Scream already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
exports.unlikeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userhandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData = {};

  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Scream not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Scream already liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(screamData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return res.json({ message: "Scream deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.json({ error: err.code });
    });
};
exports.deleteComment = (req, res) => {
  const commentDocument = db.doc(`/comments/${req.params.commentId}`);
  let screamData = {};
  let screamDocument;
  commentDocument.get()
  .then((doc)=>{
    console.log(doc.data().screamId)
    return doc.data().screamId
  })
  .then((id)=>{
    screamDocument = db.doc(`/screams/${id}`);
    console.log(screamDocument)
    
    return screamDocument.get()
  })
  .then((docs)=>{
    if (docs.exists) {

      screamData = docs.data();
      screamData.screamId = docs.id;
      console.log(screamData);
      return commentDocument.get();
    } else {
      return res.status(404).json({ error: "Scream not found" });
    }
  })
  .then((data) => {
    console.log(data.data());
    console.log(req.user.handle);
    if (data.data().userHandle !== req.user.handle) {
      return res.status(403).json({ error: "Unauthorized" });
    } else {
      return db
        .doc(`/comments/${req.params.commentId}`)
        .delete()
        .then(() => {
          screamData.commentCount--;
          return screamDocument.update({
            commentCount: screamData.commentCount,
          });
        })
        .then(() => {
          return res.json({ message: "Comment deleted successfully" });
        });
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json({ error: err.code });
  });

}
// exports.deleteComment = (req, res) => {
//   const document = db.doc(`/comments/${req.params.commentId}`);

//   document.get().then((doc) => {
//     if (!doc.exists) {
//       return res.status(404).json({ error: "Comment not found" });
//     }

//     if (doc.data().userhandle !== req.user.handle) {
//       return res.status(403).json({ error: "Unauthorized" });
//     } else {
//       return document.delete()
//     }
//   })
//   .then(()=>{
//     return res.json({message:"comment deleted successfully"})
//   }).
//   catch(err=>{
//     console.error(err)
//     return res.json({error:err.code})
//   })
// };

  // const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  // let screamData = {};

  // screamDocument
  //   .get()
  //   .then((doc) => {
  //     if (doc.exists) {
  //       screamData = doc.data();
  //       screamData.screamId = doc.id;
  //       console.log(screamData);
  //       return commentDocument.get();
  //     } else {
  //       return res.status(404).json({ error: "Scream not found" });
  //     }
  //   })
  //   .then((data) => {
  //     console.log(data.data());
  //     console.log(req.user.handle);
  //     if (data.data().userHandle !== req.user.handle) {
  //       return res.status(403).json({ error: "Unauthorized" });
  //     } else {
  //       return db
  //         .doc(`/comments/${req.params.commentId}`)
  //         .delete()
  //         .then(() => {
  //           screamData.commentCount--;
  //           return screamDocument.update({
  //             commentCount: screamData.commentCount,
  //           });
  //         })
  //         .then(() => {
  //           return res.json({ message: "Comment deleted successfully" });
  //         });
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500).json({ error: err.code });
  //   });


// comment/Oyr7VAcGvMSsggILGkM0/roSqr2KzDviFvZAS8of6
// {
//   "email":"testing1@email.com",
//   "password":"test1234"
// }

// comment/a2M4NkYNllFZTQ8sogTk/roSqr2KzDviFvZAS8of6
// scream/roSqr2KzDviFvZAS8of6/comment