(function () {
  'use strict';

  describe('Chatrooms Controller Tests', function () {
    // Initialize global variables
    var ChatroomsController,
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

      // create mock Chatroom
      mockChatroom = new ChatroomsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Chatroom Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Chatrooms controller.
      ChatroomsController = $controller('ChatroomsController as vm', {
        $scope: $scope,
        chatroomResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleChatroomPostData;

      beforeEach(function () {
        // Create a sample Chatroom object
        sampleChatroomPostData = new ChatroomsService({
          name: 'Chatroom Name'
        });

        $scope.vm.chatroom = sampleChatroomPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ChatroomsService) {
        // Set POST response
        $httpBackend.expectPOST('api/chatrooms', sampleChatroomPostData).respond(mockChatroom);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Chatroom was created
        expect($state.go).toHaveBeenCalledWith('chatrooms.view', {
          chatroomId: mockChatroom._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/chatrooms', sampleChatroomPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Chatroom in $scope
        $scope.vm.chatroom = mockChatroom;
      });

      it('should update a valid Chatroom', inject(function (ChatroomsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/chatrooms\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('chatrooms.view', {
          chatroomId: mockChatroom._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ChatroomsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/chatrooms\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Chatrooms
        $scope.vm.chatroom = mockChatroom;
      });

      it('should delete the Chatroom and redirect to Chatrooms', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/chatrooms\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('chatrooms.list');
      });

      it('should should not delete the Chatroom and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
