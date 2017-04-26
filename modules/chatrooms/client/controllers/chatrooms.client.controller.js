(function () {
  'use strict';

  // Chatrooms controller
  angular
    .module('chatrooms')
    .controller('ChatroomsController', ChatroomsController);

  ChatroomsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'chatroomResolve'];

  function ChatroomsController ($scope, $state, $window, Authentication, chatroom) {
    var vm = this;

    vm.authentication = Authentication;
    vm.chatroom = chatroom;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Chatroom
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.chatroom.$remove($state.go('chatrooms.list'));
      }
    }

    // Save Chatroom
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.chatroomForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.chatroom._id) {
        vm.chatroom.$update(successCallback, errorCallback);
      } else {
        vm.chatroom.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('chatrooms.view', {
          chatroomId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
