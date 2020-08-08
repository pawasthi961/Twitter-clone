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


app.get('/screams', (req,res) =>{
    admin
    .firestore()
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

    admin.firestore().collection('screams')
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
        photoURL : req.body.photoURL
    };
    // validate data
    firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password)
        .then(data =>{
            return res.json({data , message:`user ${data.user.uid} signed up successfully`})
            
        })
        .catch(err=>{
            console.log(err);
            return res.status(500).json({error:err.code});
        })
})

exports.api = functions.https.onRequest(app);