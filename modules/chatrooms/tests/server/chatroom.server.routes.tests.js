'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Chatroom = mongoose.model('Chatroom'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  chatroom;

/**
 * Chatroom routes tests
 */
describe('Chatroom CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Chatroom
    user.save(function () {
      chatroom = {
        name: 'Chatroom name',
        type: 'P',
        users: [user]
      };

      done();
    });
  });

  it('should be able to save a Chatroom if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Chatroom
        agent.post('/api/chatrooms')
          .send(chatroom)
          .expect(200)
          .end(function (chatroomSaveErr, chatroomSaveRes) {
            // Handle Chatroom save error
            if (chatroomSaveErr) {
              return done(chatroomSaveErr);
            }

            // Get a list of Chatrooms
            agent.get('/api/chatrooms')
              .end(function (chatroomsGetErr, chatroomsGetRes) {
                // Handle Chatrooms save error
                if (chatroomsGetErr) {
                  return done(chatroomsGetErr);
                }

                // Get Chatrooms list
                var chatrooms = chatroomsGetRes.body;

                // Set assertions
                (chatrooms[0].user._id).should.equal(userId);
                (chatrooms[0].name).should.match('Chatroom name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Chatroom if not logged in', function (done) {
    agent.post('/api/chatrooms')
      .send(chatroom)
      .expect(403)
      .end(function (chatroomSaveErr, chatroomSaveRes) {
        // Call the assertion callback
        done(chatroomSaveErr);
      });
  });

  it('should not be able to save an Chatroom if no name is provided', function (done) {
    // Invalidate name field
    chatroom.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Chatroom
        agent.post('/api/chatrooms')
          .send(chatroom)
          .expect(400)
          .end(function (chatroomSaveErr, chatroomSaveRes) {
            // Set message assertion
            (chatroomSaveRes.body.message).should.match('Please fill Chatroom name');

            // Handle Chatroom save error
            done(chatroomSaveErr);
          });
      });
  });

  it('should be able to update an Chatroom if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Chatroom
        agent.post('/api/chatrooms')
          .send(chatroom)
          .expect(200)
          .end(function (chatroomSaveErr, chatroomSaveRes) {
            // Handle Chatroom save error
            if (chatroomSaveErr) {
              return done(chatroomSaveErr);
            }

            // Update Chatroom name
            chatroom.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Chatroom
            agent.put('/api/chatrooms/' + chatroomSaveRes.body._id)
              .send(chatroom)
              .expect(200)
              .end(function (chatroomUpdateErr, chatroomUpdateRes) {
                // Handle Chatroom update error
                if (chatroomUpdateErr) {
                  return done(chatroomUpdateErr);
                }

                // Set assertions
                (chatroomUpdateRes.body._id).should.equal(chatroomSaveRes.body._id);
                (chatroomUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Chatrooms if not signed in', function (done) {
    // Create new Chatroom model instance
    var chatroomObj = new Chatroom(chatroom);

    // Save the chatroom
    chatroomObj.save(function () {
      // Request Chatrooms
      request(app).get('/api/chatrooms')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Chatroom if not signed in', function (done) {
    // Create new Chatroom model instance
    var chatroomObj = new Chatroom(chatroom);

    // Save the Chatroom
    chatroomObj.save(function () {
      request(app).get('/api/chatrooms/' + chatroomObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', chatroom.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Chatroom with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/chatrooms/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Chatroom is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Chatroom which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Chatroom
    request(app).get('/api/chatrooms/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Chatroom with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Chatroom if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Chatroom
        agent.post('/api/chatrooms')
          .send(chatroom)
          .expect(200)
          .end(function (chatroomSaveErr, chatroomSaveRes) {
            // Handle Chatroom save error
            if (chatroomSaveErr) {
              return done(chatroomSaveErr);
            }

            // Delete an existing Chatroom
            agent.delete('/api/chatrooms/' + chatroomSaveRes.body._id)
              .send(chatroom)
              .expect(200)
              .end(function (chatroomDeleteErr, chatroomDeleteRes) {
                // Handle chatroom error error
                if (chatroomDeleteErr) {
                  return done(chatroomDeleteErr);
                }

                // Set assertions
                (chatroomDeleteRes.body._id).should.equal(chatroomSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Chatroom if not signed in', function (done) {
    // Set Chatroom user
    chatroom.user = user;

    // Create new Chatroom model instance
    var chatroomObj = new Chatroom(chatroom);

    // Save the Chatroom
    chatroomObj.save(function () {
      // Try deleting Chatroom
      request(app).delete('/api/chatrooms/' + chatroomObj._id)
        .expect(403)
        .end(function (chatroomDeleteErr, chatroomDeleteRes) {
          // Set message assertion
          (chatroomDeleteRes.body.message).should.match('User is not authorized');

          // Handle Chatroom error error
          done(chatroomDeleteErr);
        });

    });
  });

  it('should be able to get a single Chatroom that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Chatroom
          agent.post('/api/chatrooms')
            .send(chatroom)
            .expect(200)
            .end(function (chatroomSaveErr, chatroomSaveRes) {
              // Handle Chatroom save error
              if (chatroomSaveErr) {
                return done(chatroomSaveErr);
              }

              // Set assertions on new Chatroom
              (chatroomSaveRes.body.name).should.equal(chatroom.name);
              should.exist(chatroomSaveRes.body.user);
              should.equal(chatroomSaveRes.body.user._id, orphanId);

              // force the Chatroom to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Chatroom
                    agent.get('/api/chatrooms/' + chatroomSaveRes.body._id)
                      .expect(200)
                      .end(function (chatroomInfoErr, chatroomInfoRes) {
                        // Handle Chatroom error
                        if (chatroomInfoErr) {
                          return done(chatroomInfoErr);
                        }

                        // Set assertions
                        (chatroomInfoRes.body._id).should.equal(chatroomSaveRes.body._id);
                        (chatroomInfoRes.body.name).should.equal(chatroom.name);
                        should.equal(chatroomInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Chatroom.remove().exec(done);
    });
  });
});
