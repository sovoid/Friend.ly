var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("../utils/handlers/user");
var textParser = require("../utils/text-parser");
var formParser = require("../utils/form-parser");
var ta = require("time-ago");

/* GET users listing. */
router.get("/", function(req, res, next) {
  db.getAll((err, users) => {
    console.log(users);
    res.render("user/list", {
      title: req.app.conf.name,
      list: users
    });
  });
});

router.get("/@:username", function(req, res, next) {
  db.findOne({ username: req.params.username }, (err, user) => {
    db.getAll((err, users) => {
      if (!user) {
        return res.status(404).send("No user found");
      }
      user.bio = textParser(user.bio);
      user.since = (function (o) { var t = Math.floor((new Date - o) / 1e3), r = Math.floor(t / 31536e3); return r > 1 ? r + " years" : (r = Math.floor(t / 2592e3)) > 1 ? r + " months" : (r = Math.floor(t / 86400)) > 1 ? r + " days" : (r = Math.floor(t / 3600)) > 1 ? r + " hours" : (r = Math.floor(t / 60)) > 1 ? r + " minutes" : Math.floor(t) + " seconds" })(user.created_at);
      res.render("user/profile", {
        title: req.app.conf.name,
        u: user,
        people: users,
        userId: req.session.user.id
      });
    });
  });
});
module.exports = router;
