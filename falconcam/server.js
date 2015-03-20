
(function() {
  var Paparazzo, app, btoa, http, io, paparazzo, sendImage, updatedImage;

  sendImage1 = function() {
    var base64Image;
    base64Image = "data:image/jpeg;base64," + btoa(updatedImage);
    io.emit("image1 sent", base64Image);
    // console.log("Sent image1 of " + base64Image.length + " bytes");
  };

  sendImage2 = function() {
    var base64Image;
    base64Image = "data:image/jpeg;base64," + btoa(updatedImage);
    io.emit("image2 sent", base64Image);
    // console.log("Sent image2 of " + base64Image.length + " bytes");
 };


  btoa = require('btoa');

  Paparazzo = require("../src/paparazzo");

  app = require("express")();

  http = require("http").Server(app);

  io = require("socket.io")(http);

  paparazzo1 = new Paparazzo({
    host: '66.218.16.11',
    port: 80,
    path: '/goform/stream?cmd=get&channel=0'
  });

  paparazzo2 = new Paparazzo({
    host: '66.218.16.12',
    port: 80,
    path: '/goform/stream?cmd=get&channel=0'
  });

  updatedImage = "";

  paparazzo1.on("update", (function(_this) {
    return function(image) {
      updatedImage = String(image);
      return sendImage1(updatedImage);
    };
  })(this));

  paparazzo1.on('error', (function(_this) {
    return function(error) {
      return console.log("Error: " + error.message);
    };
  })(this));

  paparazzo1.start();

// **********************

  paparazzo2.on("update", (function(_this) {
    return function(image) {
      updatedImage = String(image);
      return sendImage2(updatedImage);
    };
  })(this));

  paparazzo2.on('error', (function(_this) {
    return function(error) {
      return console.log("Error: " + error.message);
    };
  })(this));

  paparazzo2.start();

  app.get("/", function(req, res) {
    res.sendfile("falconcam/index.html");
  });

  io.on("connection", function(socket) {
    var now = Date.now()
    console.log(now + " a user connected");
  });

  http.listen(3000, function() {
    console.log("server up");
  });

}).call(this);
