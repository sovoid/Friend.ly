var express = require("express");
var router = express.Router();
var db = require("../utils/handlers/user");
var formParser = require("../utils/form-parser.js");
var passport = require("passport");
var User = require("../utils/models/user");
var validator = require("validator");
var querystring = require("querystring");
var _ = require("lodash");
//PS: Passport stuff to be done below...
router.get("/twitter", passport.authenticate("twitter"));

router.get("/google", passport.authenticate("google", { scope: ["https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"] }));

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

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/err" }), function (req, res) {
  if (req.session.passport.user.exists) {
    delete req.session.passport.user.exists;
    req.session.user = req.session.passport.user;
    res.redirect(
      "/?logged-in=" +
      Math.random()
        .toString()
        .slice(2)
        .slice(0, 5)
    );
  } else {
    var query = querystring.stringify({
      "username": req.session.passport.user.username,
      "loginType": "google"
    });
  
    res.redirect("/account/quiz?" + query);
  }
})

router.post("/getin", formParser, function (req, res, next) {
  db.checkUser(req.body, function (err, user) {
    if (err) {
      res.redirect("/?error=" + err);
    } else {
      req.session.user = user;
      res.redirect(
        "/?logged-in=" +
        Math.random()
          .toString()
          .slice(2)
          .slice(0, 5)
      );
    }
  })
});

router.post("/new", formParser, function (req, res, next) {
  var errMsg = "";
  if (req.body.password !== req.body.password2) {
    errMsg = "Passwords don't match.";
  } else if (!validator.isEmail(req.body.email)) {
    errMsg = "Invalid email.";
  } else if (validator.isEmpty(req.body.firstname) || validator.isEmpty(req.body.lastname) || validator.isEmpty(req.body.username)) {
    errMsg = "Username, First Name or Last Name cannot be empty!";
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
          error
        });
      } else {
        _.set(req.session, ["passport", "user"], result);
        var query = querystring.stringify({
          "username": result.username,
          "loginType": "friendly"
        });
        res.redirect("/account/quiz?" + query);
      }
    });
  }
});

router.get("/quiz", function (req, res, next) {
  res.render("auth/quiz", {
    title: req.app.conf.name,
    username: req.query.username,
    loginType: req.query.loginType
  });
});

router.post("/quiz", formParser, function (req, res, next) {
  function calcBigFive(start) {
    let sum = 0;
    for (let i = start; i <= 50; i = i + 5) {
      sum += Number(req.body[`answerGroup${i}`]);
    }
    return sum;
  }

  var bigFive = {
    "o": calcBigFive(5) / 50,
    "c": calcBigFive(3) / 50,
    "e": calcBigFive(1) / 50,
    "a": calcBigFive(2) / 50,
    "n": calcBigFive(4) / 50
  };
  
  _.set(req.session.passport.user, ["bigFive"], bigFive);

  var newUser = new User(req.session.passport.user);
  if (newUser.loginType === "friendly") {
    newUser.password = newUser.generateHash(newUser.password);
  }

  newUser.save(function (err, result) {
    req.session.user = result;
    console.log(req.session.user);
    res.redirect(
      "/?logged-in=" +
      Math.random()
        .toString()
        .slice(2)
        .slice(0, 5)
    );
  });
});

router.get("/out", function(req, res, next) {
  req.session.destroy(() => {
    res.redirect("/?action=logout");
  });
});

module.exports = router;
