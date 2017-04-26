'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Chatrooms Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/chatrooms',
      permissions: '*'
    }, {
      resources: '/api/chatrooms/:chatroomId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/chatrooms',
      permissions: ['get', 'post']
    }, {
      resources: '/api/chatrooms/:chatroomId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/chatrooms',
      permissions: ['get']
    }, {
      resources: '/api/chatrooms/:chatroomId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Chatrooms Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Chatroom is being processed and the current user created it then allow any manipulation
  if (req.chatroom && req.user && req.chatroom.user && req.chatroom.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
