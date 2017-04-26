'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket', 'Admin', 'ChatroomsService',
  function ($scope, $location, Authentication, Socket, Admin, ChatroomsService) {
    // Create a messages array
    $scope.authenID = Authentication.user._id;
    $scope.messages = [];
    Admin.query(function (data) {
      $scope.users = data;
    });
    $scope.chatlist = ChatroomsService.query();
    // $scope.userSelect = $scope.userSelect ? $scope.userSelect : {};
    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }
    $scope.createGroup = function (user) {
      $scope.userSelect = user;
      console.log(user);

      var data = {
        name: Authentication.user.username + '' + user.username,
        type: 'P',
        users: [Authentication.user, user],
        user: Authentication.user
      };
      Socket.emit('createroom', data);
    };

    // Add an event listener to the 'invite' event
    Socket.on('invite', function (data) {
      console.log('invite : ' + data);
      Socket.emit('join', data);
    });

    // Add an event listener to the 'joinsuccess' event
    Socket.on('joinsuccess', function (data) {
      $scope.room = data;
      console.log('joinsuccess : ' + data);
    });

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
    });

    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      $scope.room.text = this.messageText;
      // $scope.room.roomId = _id : pass roomId สำหรับ update massage
      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', $scope.room);

      // Clear the message text
      this.messageText = '';
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });
  }
]);
