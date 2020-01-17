var express = require("express");
var router = express.Router();
var user = require("../utils/handlers/user");
var array_tools = require("array-tools");
const Prism = require("prismjs");

router.get("/", function(req, res, next) {
  if (req.session.user) {
    user.getAll((err, users) => {
      user.findOne({ id: req.session.user.id }, (error, req_user) => {
        req.app.events.map((a, b) => {
          if (a.time[1] < new Date()) {
            req.app.events.slice(a);
          }
        });
        res.render("index", {
          user: req_user,
          title: req.app.conf.name,
          people: users,
          events: req.app.events
        });
      });
    });
  } else {
    res.render("land", {
      title: req.app.conf.name,
      error: false
    });
  }
});

module.exports = router;
