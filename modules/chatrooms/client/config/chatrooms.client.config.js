(function () {
  'use strict';

  angular
    .module('chatrooms')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Chatrooms',
      state: 'chatrooms',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'chatrooms', {
      title: 'List Chatrooms',
      state: 'chatrooms.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'chatrooms', {
      title: 'Create Chatroom',
      state: 'chatrooms.create',
      roles: ['user']
    });
  }
}());
