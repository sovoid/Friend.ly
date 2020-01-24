var express = require("express");
var router = express.Router();
var db = require("../utils/handlers/user");
var formParser = require("../utils/form-parser.js");
var passport = require("passport");
var User = require("../utils/models/user");
var validator = require("validator");

//PS: Passport stuff to be done below...
router.get("/twitter", passport.authenticate("twitter"));

router.get("/new", function (req, res, next) {
  res.render("auth/signup", {
    title: req.app.conf.name,
    error: false
  })
});

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/err" }),
  function (req, res) {
    // Successful authentication, redirect home.
    req.session.user = req.session.passport.user;
    res.redirect(
      "/?logged-in=" +
      Math.random()
        .toString()
        .slice(2)
        .slice(0, 5)
    );
  }
);

router.post("/new", formParser, function (req, res, next) {
  var errMsg = ""
  if (req.body.password !== req.body.password2) {
    errMsg = "Passwords don't match."
  } else if (!validator.isEmail(req.body.email)) {
    errMsg = "Invalid email."
  } else if (validator.isEmpty(req.body.firstname) || validator.isEmpty(req.body.lastname) || validator.isEmpty(req.body.username)) {
    errMsg = "Username, First Name or Last Name cannot be empty!"
  }

  if (errMsg) {
    res.render("auth/signup", {
      title: req.app.conf.name,
      error: errMsg
    });
  } else {
    db.createNew(req.body, function (error, result) {
      if (error && !result) {
        res.render("auth/signup", {
          title: req.app.conf.name,
          error: error
        });
      } else {
        req.session.user = result;
        res.redirect(
          "/?logged-in=" +
          Math.random()
            .toString()
            .slice(2)
            .slice(0, 5)
        );
      }
    })
  }
})

router.get("/out", function(req, res, next) {
  req.session.destroy(() => {
    res.redirect("/?action=logout");
  });
});

module.exports = router;
