(function () {
  'use strict';

  describe('Chatrooms Route Tests', function () {
    // Initialize global variables
    var $scope,
      ChatroomsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ChatroomsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ChatroomsService = _ChatroomsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('chatrooms');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/chatrooms');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ChatroomsController,
          mockChatroom;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('chatrooms.view');
          $templateCache.put('modules/chatrooms/client/views/view-chatroom.client.view.html', '');

          // create mock Chatroom
          mockChatroom = new ChatroomsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Chatroom Name'
          });

          // Initialize Controller
          ChatroomsController = $controller('ChatroomsController as vm', {
            $scope: $scope,
            chatroomResolve: mockChatroom
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:chatroomId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.chatroomResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            chatroomId: 1
          })).toEqual('/chatrooms/1');
        }));

        it('should attach an Chatroom to the controller scope', function () {
          expect($scope.vm.chatroom._id).toBe(mockChatroom._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/chatrooms/client/views/view-chatroom.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ChatroomsController,
          mockChatroom;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('chatrooms.create');
          $templateCache.put('modules/chatrooms/client/views/form-chatroom.client.view.html', '');

          // create mock Chatroom
          mockChatroom = new ChatroomsService();

          // Initialize Controller
          ChatroomsController = $controller('ChatroomsController as vm', {
            $scope: $scope,
            chatroomResolve: mockChatroom
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.chatroomResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/chatrooms/create');
        }));

        it('should attach an Chatroom to the controller scope', function () {
          expect($scope.vm.chatroom._id).toBe(mockChatroom._id);
          expect($scope.vm.chatroom._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/chatrooms/client/views/form-chatroom.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ChatroomsController,
          mockChatroom;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('chatrooms.edit');
          $templateCache.put('modules/chatrooms/client/views/form-chatroom.client.view.html', '');

          // create mock Chatroom
          mockChatroom = new ChatroomsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Chatroom Name'
          });

          // Initialize Controller
          ChatroomsController = $controller('ChatroomsController as vm', {
            $scope: $scope,
            chatroomResolve: mockChatroom
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:chatroomId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.chatroomResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            chatroomId: 1
          })).toEqual('/chatrooms/1/edit');
        }));

        it('should attach an Chatroom to the controller scope', function () {
          expect($scope.vm.chatroom._id).toBe(mockChatroom._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/chatrooms/client/views/form-chatroom.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
