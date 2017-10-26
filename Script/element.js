
const firebase = require('firebase');
const request = require('request');

const config = {
    "apiKey": "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
    "authDomain": "universalgamemaker.firebaseapp.com",
    "databaseURL": "https://universalgamemaker.firebaseio.com",
    "projectId": "universalgamemaker",
    "storageBucket": "universalgamemaker.appspot.com",
    "messagingSenderId": "144595629077",
    "basename": "GameBuilder"
};

const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.database();
const auth = firebaseApp.auth();

let email = "youremail";
let password = "yourpassword";
firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
  console.log('uid',user.uid)

  const ref = db.ref('gameBuilder/elements');
  
  var fs=require('fs');
  var file = "universalgamemaker-export.json";
  var result = JSON.parse(fs.readFileSync(file));
  var images = result["images"];
  
  for(var image in images) {
	if(images[image]["uploader_email"] === undefined)
          continue;
    let key = image;
    let value = {};
    let image_list = [];
    
    image_list.push({"imageId": image});
	value["uploaderEmail"] = images[image]["uploader_email"];
	value["uploaderUid"] = user.uid;
	value["width"] = images[image]["width"];
	value["height"] = images[image]["height"];
    value["createdOn"] = firebase.database.ServerValue.TIMESTAMP;
    value["isDraggable"] = false;
    value["isDrawable"] = false;
    value["rotatableDegrees"] = 1;
    value["elementKind"] = "standard";
    value["images"] = image_list;

    let childkey = ref.push().key;
    ref.child(childkey).set(value)
    console.log(childkey);
  }
}).catch(function(error) {
    //Handle error
}); 

