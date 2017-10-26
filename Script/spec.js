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

  const ref = db.ref('gameBuilder/gameSpecs');
  
  var fs=require('fs');
  var file = "universalgamemaker-export.json";
  var result = JSON.parse(fs.readFileSync(file));
  var specs = result["specs"];
  let spec_map = {};
  let i = 0;
  
  for(var spec in specs) {
    let spec_json = JSON.parse(specs[spec]["spec"]);
    let board = spec_json["@board"]["@imageKey"];
    
    let board_content = {
        "backgroundColor": "FFFFFF",
        "imageId": board,
        "maxScale": 1
    };
    

    let spec_content = {
        "board": board_content,
        "createdOn": firebase.database.ServerValue.TIMESTAMP,
        "gameIcon50x50": "-KwqEPnE2xzAON9V2mcP",
        "gameIcon512x512": "-KwqEjlZ_sv95XrfTn5z",
        "gameName": spec,
        "tutorialYoutubeVideo": "",
        "uploaderEmail": "yl4308@nyu.edu",
        "uploaderUid": user.uid,
        "wikipediaUrl": "https://no-wiki.com"
    }
    
    let pieces = spec_json["@initialPositions"]["@pieces"];
    
    if(pieces.length === 0 || pieces[0] === null || pieces[0]["@imageKey"] == undefined) {
        continue;
    }

    let childkey = ref.push().key;
    ref.child(childkey).set(spec_content);
    spec_map[spec] = childkey;
    let piece_list = [];
        
    for(var piece in pieces) {
        let piece_content = {
            "deckPieceIndex": -1,
            "initialState": {
                "currentImageIndex": 0,
                "x": pieces[piece]["@positionX"],
                "y": pieces[piece]["@positionY"],
                "zDepth": 1
            },
            "pieceElementId":  ""
        }
        
        let ele_ref = db.ref('gameBuilder/elements');
                    
        ele_ref.orderByChild("images/0/imageId").equalTo(pieces[piece]["@imageKey"]).on("child_added", function(snapshot) {
            piece_content["pieceElementId"] = snapshot.key;
            piece_list.push(piece_content);
            ref.child(childkey + "/pieces").set(piece_list);
        });               
    }
  }
}).catch(function(error) {
    //Handle error
}); 


