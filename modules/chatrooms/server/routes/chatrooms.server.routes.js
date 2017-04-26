'use strict';

/**
 * Module dependencies
 */
var chatroomsPolicy = require('../policies/chatrooms.server.policy'),
  chatrooms = require('../controllers/chatrooms.server.controller');

module.exports = function(app) {
  // Chatrooms Routes
  app.route('/api/chatrooms').all(chatroomsPolicy.isAllowed)
    .get(chatrooms.list)
    .post(chatrooms.create);

  app.route('/api/chatrooms/:chatroomId').all(chatroomsPolicy.isAllowed)
    .get(chatrooms.read)
    .put(chatrooms.update)
    .delete(chatrooms.delete);

  // Finish by binding the Chatroom middleware
  app.param('chatroomId', chatrooms.chatroomByID);
};
