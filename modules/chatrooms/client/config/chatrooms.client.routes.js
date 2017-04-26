(function () {
  'use strict';

  angular
    .module('chatrooms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('chatrooms', {
        abstract: true,
        url: '/chatrooms',
        template: '<ui-view/>'
      })
      .state('chatrooms.list', {
        url: '',
        templateUrl: 'modules/chatrooms/client/views/list-chatrooms.client.view.html',
        controller: 'ChatroomsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Chatrooms List'
        }
      })
      .state('chatrooms.create', {
        url: '/create',
        templateUrl: 'modules/chatrooms/client/views/form-chatroom.client.view.html',
        controller: 'ChatroomsController',
        controllerAs: 'vm',
        resolve: {
          chatroomResolve: newChatroom
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Chatrooms Create'
        }
      })
      .state('chatrooms.edit', {
        url: '/:chatroomId/edit',
        templateUrl: 'modules/chatrooms/client/views/form-chatroom.client.view.html',
        controller: 'ChatroomsController',
        controllerAs: 'vm',
        resolve: {
          chatroomResolve: getChatroom
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Chatroom {{ chatroomResolve.name }}'
        }
      })
      .state('chatrooms.view', {
        url: '/:chatroomId',
        templateUrl: 'modules/chatrooms/client/views/view-chatroom.client.view.html',
        controller: 'ChatroomsController',
        controllerAs: 'vm',
        resolve: {
          chatroomResolve: getChatroom
        },
        data: {
          pageTitle: 'Chatroom {{ chatroomResolve.name }}'
        }
      });
  }

  getChatroom.$inject = ['$stateParams', 'ChatroomsService'];

  function getChatroom($stateParams, ChatroomsService) {
    return ChatroomsService.get({
      chatroomId: $stateParams.chatroomId
    }).$promise;
  }

  newChatroom.$inject = ['ChatroomsService'];

  function newChatroom(ChatroomsService) {
    return new ChatroomsService();
  }
}());
