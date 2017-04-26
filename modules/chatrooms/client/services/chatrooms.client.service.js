// Chatrooms service used to communicate Chatrooms REST endpoints
(function () {
  'use strict';

  angular
    .module('chatrooms')
    .factory('ChatroomsService', ChatroomsService);

  ChatroomsService.$inject = ['$resource'];

  function ChatroomsService($resource) {
    return $resource('api/chatrooms/:chatroomId', {
      chatroomId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
