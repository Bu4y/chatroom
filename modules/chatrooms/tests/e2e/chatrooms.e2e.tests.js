'use strict';

describe('Chatrooms E2E Tests:', function () {
  describe('Test Chatrooms page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/chatrooms');
      expect(element.all(by.repeater('chatroom in chatrooms')).count()).toEqual(0);
    });
  });
});
