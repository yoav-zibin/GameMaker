
const firebase = require('firebase');
const request = require('request');
require('firebase/storage');

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
const storageRef = firebaseApp.storage().ref();

let email = "youremail";
let password = "yourpassword";
firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
  console.log('uid',user.uid)

  const ref = db.ref('gameBuilder/images');
  
  var fs=require('fs');
  var file = "universalgamemaker-export.json";
  var result = JSON.parse(fs.readFileSync(file));
  var images = result["images"];
  let i = 0;
  
  for(var image in images) {
	if(images[image]["uploader_email"] === undefined)
		  continue;
	let key = image;
	let value = {};
	value["uploaderEmail"] = images[image]["uploader_email"];
	value["uploaderUid"] = user.uid;
	value["width"] = images[image]["width"];
	value["height"] = images[image]["height"];
	value["isBoardImage"] = images[image]["is_board_image"];
	value["downloadURL"] = images[image]["downloadURL"];
	value["name"] = images[image]["name"];
	let filename = images[image]["downloadURL"].split("images%2F")[1].split("?")[0];
	value["cloudStoragePath"] = "images/" + filename;
	value["createdOn"] = firebase.database.ServerValue.TIMESTAMP;
		  
	request(images[image]["downloadURL"], function (error, response, body, image) {
		if (!error && response.statusCode == 200) {
			value["sizeInBytes"] = Number(response.headers['content-length']);
			ref.child(key).set(value)	
			}
		})
	}
}).catch(function(error) {
    //Handle error
}); 

