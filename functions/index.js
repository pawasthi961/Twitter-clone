const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app  = require('express')();
admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyBoZlPwdurx8AbKNhIeCcDPchkO0XOtUUA",
    authDomain: "twitter-clone-3b2ac.firebaseapp.com",
    databaseURL: "https://twitter-clone-3b2ac.firebaseio.com",
    projectId: "twitter-clone-3b2ac",
    storageBucket: "twitter-clone-3b2ac.appspot.com",
    messagingSenderId: "214744427286",
    appId: "1:214744427286:web:43fcd9f1da01c566107e37",
    measurementId: "G-TX96HFPZQ6"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig)

const db= admin.firestore();


app.get('/screams', (req,res) =>{
    db
    .collection('screams')
    .orderBy('createdAt','desc')
    .get()
    .then((data)=>{
        let screams =[];
        data.forEach(doc=>{
            screams.push({
                screamId:doc.id,
                body : doc.data().body,
                userhandle:doc.data().userHandle,
                createdAt: doc.data().createdAt

            });
        });
        return res.json(screams)
    }).catch(err => console.error(err))
})



app.post("/scream",(req,res)=>{
    const newScream = {
        body : req.body.body,
        userHandle : req.body.userHandle,
        createdAt : new Date().toISOString()
    };

    db.collection('screams')
    .add(newScream)
    .then(doc =>{
        return res.json({message:`document ${doc.id} created successfully`})
    })
    .catch(err =>{
        res.status(500).json({error:"something went wrong"})
        console.log(err)
    })
})
    

// Signup route 
app.post('/signup',(req,res)=>{
    const newUser = {
        email:req.body.email,
        password:req.body.password,
        confirmPassword : req.body.confirmPassword,
        handle: req.body.handle,
    };
    // validate data
    let token,userId;
    db.doc(`/users/${newUser.handle}`).get()
    .then(
    (doc) =>{
        if(doc.exists){
            return res.status(400).json({ handle : "this handle is already taken"})
        }else{
            return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
        }
    })
    .then(data=>{
        userId = data.user.uid
        return data.user.getIdToken()
    }).then((idToken)=>{
        token = idToken;
        const userCredentials={
            handle : newUser.handle,
            email : newUser.email,
            createdAt:new Date().toISOString(),
            userId
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);

    })
    .then(()=>{
        return res.status(201).json({token})
    })
    .catch((err)=>{
        console.error(err);
        if(err.code === "auth/email-already-in-use"){
            return res.status(400).json({email :"email is already in use"})
        }
        return res.status(500).json({error:err})
    })
})

    
exports.api = functions.https.onRequest(app);