console.log("Welcome to Badwolf v1.1")
var Firebase = require("firebase");
var sys = require('sys');
var exec = require('child_process').exec;
var AWS = require('aws-sdk'); 
var fs = require('fs');
var zlib = require('zlib');

filedir = "/tmp/badwolfaudio/"
AWS.config.loadFromPath('/home/pi/badwolf/config/aws-config.json');
var s3 = new AWS.S3();

fb_domain = "https://badwolf.firebaseio.com"
// Register the callback to be fired every time auth state changes
var ref = new Firebase(fb_domain);
ref.onAuth(authDataCallback); 
function authHandler(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}
// Or with an email/password combination
ref.authWithPassword({
  email    : "",
  password : ""
}, authHandler);

// Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    var fb = new Firebase(fb_domain + "/users/" +authData.uid + "/audio");

    // IGNORE
    //temp = fb.child("temp")
    //var date = new Date();
    //var utc = date.toUTCString();
    //temp.set(utc);

    // TREAT
    var ref = new Firebase(fb_domain + "/users/" + authData.uid + "/treat/state");
    ref.on("value", function(snapshot) {
      if(snapshot.val() == true) {
        console.log("Treated.")

        var sys = require('sys');
        var exec = require('child_process').exec;
        function puts(error, stdout, stderr) { sys.puts(stdout) }
        exec("sudo python /home/pi/badwolf/treat.py 45");

        var date = new Date();
        var utc = date.toUTCString();
        log = fb.child("treat/log")
        log.push({stamp: utc})

        ref.set(false)
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // IMAGE
    var online = new Firebase(fb_domain + "/users/" + authData.uid + "/online");
    online.on("value", function(snapshot) {
      fs.readFile('/tmp/motion/temp.jpg', function(err, data) {
        data = "data:image/jpeg;base64," + new Buffer(data).toString('base64')
        var img = new Firebase(fb_domain + "/users/" + authData.uid + "/img");
        img.set(data);
        console.log("Imaged.")
      });
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    // AUDIO
    oldfile = "";
    online = false;
    var online = new Firebase(fb_domain + "/users/" + authData.uid + "/online");
    online.on("value", function(snapshot) {
      if(snapshot.val() == "offline") {
        online = false;
      }
      else {
        online = true;
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    setInterval(function() {
      if (online == true ) {
        // record new file
        var newfile = "clip-" +  Math.round((new Date()).getTime());
        console.log("recording new clip", newfile)
        exec("arecord -D plughw:1,0 -f cd -d 5 | lame - " + filedir + newfile + ".mp3");

        // upload old file
        if (oldfile != "") {
          uploadS3(filedir, oldfile, fb)
        }
        
        // newfile becomes oldfile
        oldfile = newfile 
      }
    }, 5000)
  } else {
    console.log("User is logged out");
  }
}


function uploadS3(dir, file, fb) {
  fs.exists(dir+file+".mp3", function(e) {
    if (e == true) {
      console.log("uploading old clip", dir+file+".mp3")
      var body = fs.createReadStream(dir + file + '.mp3') //.pipe(zlib.createGzip());
      var s3obj = new AWS.S3({params: {Bucket: 'badwolf', Key: oldfile+'.mp3'}});
      s3obj.upload({Body: body}).
        on('httpUploadProgress', function(evt) { 
          //console.log(evt); 
        }).
        send(function(err, data) { 
          console.log("uploaded", data.Location) 
          fb.set(data.Location)
        });
    }
    else {
      console.log("file not found")
    }
  })
}



