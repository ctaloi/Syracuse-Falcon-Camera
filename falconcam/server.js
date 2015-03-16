
(function() {
  var Paparazzo, app, btoa, http, io, paparazzo, sendImage, updatedImage;

  sendImage = function() {
    var base64Image;
    base64Image = "data:image/jpeg;base64," + btoa(updatedImage);
    io.emit("image sent", base64Image);
    //console.log("Sent image of " + base64Image.length + " bytes");
  };

  btoa = require('btoa');

  Paparazzo = require("../src/paparazzo");

  app = require("express")();

  http = require("http").Server(app);

  io = require("socket.io")(http);

  paparazzo = new Paparazzo({
  	host: '66.218.16.11',
  	port: 80,
  	path: '/goform/stream?cmd=get&channel=0'
  });

  updatedImage = "";

  paparazzo.on("update", (function(_this) {
    return function(image) {
      updatedImage = String(image);
      return sendImage(updatedImage);
    };
  })(this));

  paparazzo.on('error', (function(_this) {
    return function(error) {
      return console.log("Error: " + error.message);
    };
  })(this));

  paparazzo.start();

  app.get("/", function(req, res) {
    res.sendfile("falconcam/index.html");
  });

  io.on("connection", function(socket) {
    console.log("a user connected");
  });

  http.listen(5000, function() {
    console.log("listening");
  });

}).call(this);