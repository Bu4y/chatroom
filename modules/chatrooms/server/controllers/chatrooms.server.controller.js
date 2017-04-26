'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Chatroom = mongoose.model('Chatroom'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Chatroom
 */
exports.create = function(req, res) {
  var chatroom = new Chatroom(req.body);
  chatroom.user = req.user;

  chatroom.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chatroom);
    }
  });
};

/**
 * Show the current Chatroom
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var chatroom = req.chatroom ? req.chatroom.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  chatroom.isCurrentUserOwner = req.user && chatroom.user && chatroom.user._id.toString() === req.user._id.toString();

  res.jsonp(chatroom);
};

/**
 * Update a Chatroom
 */
exports.update = function(req, res) {
  var chatroom = req.chatroom;

  chatroom = _.extend(chatroom, req.body);

  chatroom.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chatroom);
    }
  });
};

/**
 * Delete an Chatroom
 */
exports.delete = function(req, res) {
  var chatroom = req.chatroom;

  chatroom.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chatroom);
    }
  });
};

/**
 * List of Chatrooms
 */
exports.list = function(req, res) {
  Chatroom.find().sort('-created').populate('user', 'displayName').exec(function(err, chatrooms) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(chatrooms);
    }
  });
};

/**
 * Chatroom middleware
 */
exports.chatroomByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Chatroom is invalid'
    });
  }

  Chatroom.findById(id).populate('user', 'displayName').exec(function (err, chatroom) {
    if (err) {
      return next(err);
    } else if (!chatroom) {
      return res.status(404).send({
        message: 'No Chatroom with that identifier has been found'
      });
    }
    req.chatroom = chatroom;
    next();
  });
};
