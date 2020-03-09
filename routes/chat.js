var express = require("express");
var router = express.Router();
var db = require("../utils/handlers/user");
var formParser = require("../utils/form-parser");
var mongoose = require("mongoose");
var User = require("../utils/models/user");
var Room = require("../utils/models/room");
var _ = require("underscore");

router.get("/", function(req, res, next) {
  User.find({}).exec((error, users) => {
    res.render("chat/index", {
      title: req.app.conf.name,
      users: (users.length >= 50) ? _.sample(users, 50) : users,
    });
  });
});

router.post("/user_rating", function (req, res, next) {
  if (req.session.user.id === req.params.userid) {
    return res.render("error", {
      message: "Can't rate yourself...",
      error: {
        status: 400,
        stack: "Can't rate yourself."
      }
    })
  } else {
    User.findOne({ id: req.body.user }).exec((err, user) => {
      if (!user.rating.value) {
        user.rating.value = parseInt(req.body.rating);
      } else {
        user.rating.value = Math.floor(((user.rating.value * user.rating.count) + req.body.rating) / (count + 1));
      }
      user.rating.count += 1;
      Room.findOne({ id: req.body.chatRoomId }).exec((err, room) => {
        console.log(room);
        room.rating.push(req.session.user.id);
        user.save((err, savedUser) => {
          if (err) {
            console.log(err);
          } else {
            room.save((err, savedRoom) => {
              if (err) {
                console.log(err)
              } else {
                console.log(savedUser);
                res.render("chat/room", {
                  title: req.app.conf.name,
                  room: savedRoom,
                  session: req.session.user,
                  reciever: savedUser
                });
              }
            })
          }
        })
      })
    })
  }
})

router.get("/:userid", function(req, res, next) {
  if (req.session.user.id === req.params.userid) {
    return res.render("error", {
      message: "Can't chat with yourself...",
      error: {
        status: 400,
        stack: "Can't chat with yourself."
      }
    });
  }
  require("../utils/handlers/socket");
  User.findOne({ id: req.params.userid }).exec((error, user) => {
    if (!user) {
      return res.status(404).send("No user found!");
    }
    req.session.socket = {};
    Room.find({}).exec((err, chatRooms) => {
      var chatRoom = chatRooms.find(
        (r) =>
          r.users[0] &&
          r.users[1] &&
          ((r.users[0].toString() === user.id.toString() &&
            r.users[1].toString() === req.session.user.id) ||
            (r.users[1].toString() === user.id.toString() &&
              r.users[0].toString() === req.session.user.id))
      );
      if (chatRoom) {
        req.session.socket.room = chatRoom.id;
        res.render("chat/room", {
          title: req.app.conf.name,
          room: chatRoom,
          session: req.session.user,
          reciever: user
        });
      } else {
        var possibleRoomId = user.id + req.session.user.id;
        req.session.socket.room = possibleRoomId;
        var newChatRoom = new Room({
          id: possibleRoomId,
          users: [user.id, req.session.user.id],
          chats: [],
          rating: []
        });
        newChatRoom.save((err, done) => {
          res.render("chat/room", {
            title: req.app.conf.name,
            room: done,
            session: req.session.user,
            reciever: user
          });
        });
      }
    });
  });
});

module.exports = router;
