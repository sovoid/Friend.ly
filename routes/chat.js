var express = require("express");
var router = express.Router();
var db = require("../utils/handlers/user");
var formParser = require("../utils/form-parser");
var mongoose = require("mongoose");
var User = require("../utils/models/user");
var Room = require("../utils/models/room");
var _ = require("underscore");
var guid = require("guid");

router.get("/", function (req, res, next) {
  User.find({}).exec((error, users) => {
    let chattedWith = [];

    if (req.session.user.chats.length) {
      users = _.reject(users, (eachUser) => {
        if (req.session.user.chats[eachUser.id]) {
          chattedWith.push(eachUser);
        }
        return req.session.user.chats[eachUser.id];
      })
    }
    
    res.render("chat/index", {
      title: req.app.conf.name,
      users: (users.length >= 50) ? _.sample(users, 50) : users,
      chattedWith
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
    User.findOne({
      id: req.body.user
    }).exec((err, user) => {
      if (!user.rating.value) {
        user.rating.value = parseInt(req.body.rating);
      } else {
        user.rating.value = Math.floor(((user.rating.value * user.rating.count) + req.body.rating) / (count + 1));
      }
      user.rating.count += 1;
      Room.findOne({
        id: req.body.chatRoomId
      }).exec((err, room) => {
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

router.get("/:userid", function (req, res, next) {
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
  User.findOne({
    id: req.params.userid
  }).exec((error, chatUser) => {
    if (!chatUser) {
      return res.status(404).send("No user found!");
    }
    req.session.socket = {};
    
    if (req.session.user.chats[chatUser.id]) {
      let chatRoomId = req.session.user.chats[chatUser.id];
      Room.findOne({
        id: chatRoomId
      }).exec((err, chatRoom) => {
        req.session.socket.room = chatRoomId;
        res.render("chat/room", {
          title: req.app.conf.name,
          room: chatRoom,
          session: req.session.user,
          reciever: chatUser
        })
      })
    } else {
      var newChatRoom = new Room({
        id: guid.raw(),
        users: [chatUser.id, req.session.user.id],
        chats: [],
        rating: []
      });
      
      newChatRoom.save((err, savedChatRoom) => {
        console.log("New chat room created");
        req.session.socket.room = savedChatRoom.id;
        chatUser.chats[req.session.user.id] = savedChatRoom.id;
        chatUser.markModified("chats");
        chatUser.save((err, savedChatUser) => {
          User.findOne({
            id: req.session.user.id
          }).exec((err, reqUser) => {
            reqUser.chats[savedChatUser.id] = savedChatRoom.id;
            reqUser.markModified("chats");
            reqUser.save((err, savedReqUser) => {
              res.render("chat/room", {
                title: req.app.conf.name,
                room: savedChatRoom,
                session: savedReqUser,
                reciever: savedChatUser
              });
            })
          })
        })
      })
    }
  });
});

module.exports = router;