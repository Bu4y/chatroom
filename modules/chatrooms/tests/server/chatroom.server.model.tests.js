'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Chatroom = mongoose.model('Chatroom');

/**
 * Globals
 */
var user,
  chatroom;

/**
 * Unit tests
 */
describe('Chatroom Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      chatroom = new Chatroom({
        name: 'Chatroom Name',
        type: 'P',
        users: [user],
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return chatroom.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      chatroom.name = '';

      return chatroom.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without type', function (done) {
      chatroom.type = '';

      return chatroom.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save type out of enum P or G', function (done) {
      chatroom.type = 'T';

      return chatroom.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without users', function (done) {
      chatroom.users = null;

      return chatroom.save(function (err) {
        should.exist(err);
        done();
      });
    });

  });

  afterEach(function (done) {
    Chatroom.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
