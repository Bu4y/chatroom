(function () {
  'use strict';

  angular
    .module('chatrooms')
    .controller('ChatroomsListController', ChatroomsListController);

  ChatroomsListController.$inject = ['ChatroomsService'];

  function ChatroomsListController(ChatroomsService) {
    var vm = this;

    vm.chatrooms = ChatroomsService.query();
  }
}());
