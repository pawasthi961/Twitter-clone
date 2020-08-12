const functions = require("firebase-functions");

const app = require("express")();
const FBAuth = require("./util/FBAuth");
const { db } = require("./util/admin");

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
  deleteComment,
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require("./handlers/users");

//Scream routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);
app.get("/scream/:screamId", getScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);
app.get("/uncomment/:commentId", FBAuth, deleteComment);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);

//users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle",getUserDetails)
app.post("/notifications",FBAuth,markNotificationsRead)



exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate((snapshot) => {
    console.log(snapshot.data());
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "like",
          read: false,
          screamId: doc.id,
        });
      })

      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.deleteNotificationOnUnLike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    console.log(snapshot.data())
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()

      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.deleteNotificationOnUncomment = functions.firestore
  .document("comments/{id}")
  .onDelete((snapshot) => {
    console.log(snapshot.data())
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()

      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    console.log(snapshot.data());
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: "comment",
          read: false,
          screamId: doc.id,
        });

        
      })

      .catch((err) => {
        console.error(err);
        return;
      });
  });
