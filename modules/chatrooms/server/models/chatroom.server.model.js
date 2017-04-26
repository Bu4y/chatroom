'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Chatroom Schema
 */
var ChatroomSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Chatroom name',
    trim: true
  },
  type: {
    type: String,
    enum: ['P', 'G'],
    required: 'Please fill Chatroom type'
  },
  users: {
    type: [
      {
        type: Schema.ObjectId,
        ref: 'User'
      }
    ],
    required: 'Please fill Chatroom users'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Chatroom', ChatroomSchema);
