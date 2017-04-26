'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Chatroom = mongoose.model('Chatroom'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  io.emit('mobile', {
    type: 'status',
    text: 'Is now connected with mobile',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username
  });

  socket.join(socket.request.user.username);

  // create room
  socket.on('createroom', function (data) {
    // console.log('createroom Data : ' + data);
    var chatroom = new Chatroom(data);
    chatroom.user = socket.request.user;

    chatroom.save(function (err) {
      if (err) {
        // return res.status(400).send({
        //   message: errorHandler.getErrorMessage(err)
        // });
        // console.log('error : ' + JSON.stringify(err));
      } else {
        // console.log('success' + JSON.stringify(chatroom));
        data.users.forEach(function (user) {
          // console.log('success' + JSON.stringify(chatroom));
          // console.log(JSON.stringify(user));
          io.sockets.in(user.username).emit('invite', data);
        });
        // res.jsonp(chatroom);
      }
    });
  });


  socket.on('join', function (data) {
    // console.log('join : ' + JSON.stringify(data));
    socket.join(data.name);
    io.sockets.in(data.name).emit('joinsuccess', data);
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatMessage', function (message) {
    // console.log('chatMessage : ' + JSON.stringify(message));
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;

    // Emit the 'chatMessage' event
    io.sockets.in(message.name).emit('chatMessage', message);
  });

  // Emit the status event when a socket client is disconnected
  // socket.on('disconnect', function () {
  //   io.emit('chatMessage', {
  //     type: 'status',
  //     text: 'disconnected',
  //     created: Date.now(),
  //     username: socket.request.user.username
  //   });
  // });
};
