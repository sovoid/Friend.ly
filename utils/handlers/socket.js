var User = require("../models/user");
var Room = require("../models/room");
const sio = require("../../bin/www").sio;
const sessionMiddleware = require("../../app").sessionMiddleware;

sio.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

function type(socket) {
  User.findOne({ id: socket.session.user.id }).exec(function(err, u) {
    socket
      .to(socket.session.socket.room)
      .emit("typing", { username: u.username });
  });
}

function sendMsg(socket, chat) {
  var time = new Date();
  var room = socket.room;
  if (!room.chats) {
    room.chats = [];
  }
  User.findOne({ id: socket.session.user.id }).exec(function(err, u) {
    const user = {
      username: u.username,
      profile_picture: u.profile_picture,
      id: u.id
    };
    room.chats.push({ txt: chat.txt, by: user, time });
    console.log({ txt: chat.txt, by: user, time });

    room.save((err, obj) => {
      sio.to(socket.session.socket.room).emit("new msg", {
        txt: chat.txt,
        by: user,
        time
      });
      //userData.notifications
      let otherUser = room.users.find(x => x != u.id);
      User.findOne({ id: otherUser }).exec(function(err, otherU) {
        otherU.notifications.push({
          id: Math.random(),
          msg: `@${u.username} sent you a message: ${chat.txt}`,
          link: `/chat/${u.id}`,
          time: new Date()
        });
        otherU.save();
      });
    });
  });
}

sio.on("connection", function(socket) {
  const session = socket.request.session;
  socket.session = session;
  socket.join(session.socket.room);
  Room.findOne({ id: session.socket.room }, function(err, room) {
    if (!room) {
      return socket.disconnect("unauthorized");
    }
    socket.room = room;
  });
  socket.on("msg", function(data) {
    sendMsg(socket, data);
  });
  socket.on("typing", function(data) {
    type(socket);
  });
});

module.exports = sio;
