(function () {
  'use strict';

  describe('Chatrooms List Controller Tests', function () {
    // Initialize global variables
    var ChatroomsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ChatroomsService,
      mockChatroom;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ChatroomsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ChatroomsService = _ChatroomsService_;

      // create mock article
      mockChatroom = new ChatroomsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Chatroom Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Chatrooms List controller.
      ChatroomsListController = $controller('ChatroomsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockChatroomList;

      beforeEach(function () {
        mockChatroomList = [mockChatroom, mockChatroom];
      });

      it('should send a GET request and return all Chatrooms', inject(function (ChatroomsService) {
        // Set POST response
        $httpBackend.expectGET('api/chatrooms').respond(mockChatroomList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.chatrooms.length).toEqual(2);
        expect($scope.vm.chatrooms[0]).toEqual(mockChatroom);
        expect($scope.vm.chatrooms[1]).toEqual(mockChatroom);

      }));
    });
  });
}());
