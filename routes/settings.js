require("dotenv").config();
var express = require("express");
var router = express.Router();
var path = require("path");
var guid = require("guid");
var _ = require("underscore");
var mv = require("mv");
const mime = require("mime-types");
var db = require("../utils/models/user");
var formParser = require("../utils/form-parser.js");
const fs = require("file-system");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const s3 = new AWS.S3();
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "frenly",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, `feeds/${req.session.user.id}_${Date.now()}.${file.originalname
        .split(".").pop().toLowerCase}`);
    }
   })
})

var file_types = ["png", "jpeg", "gif", "jpg", "mov", "mp4"];

/* GET users listing. */

router.get("/", function(req, res, next) {
  res.redirect("/u/@" + req.session.user.username);
});

router.get("/settings", function(req, res, next) {
  db.findOne({ _id: req.session.user._id }).exec((err, user) => {
    res.render("me/settings", {
      title: req.app.conf.name,
      user
    });
  });
});

router.get("/activity", function(req, res, next) {
  db.findOne({ id: req.session.user.id }).exec((err, user) => {
    res.render("me/activity", {
      title: req.app.conf.name,
      activity: user.notifications
    });
  });
});

router.get("/post/:action/:query", function(req, res, next) {
  switch (req.params.action) {
    case "edit":
      res.render("index");
      break;
    case "delete":
      {
        db.findOne({ id: req.session.user.id }).exec((err, u) => {
          let id = req.params.query;
          let postToDelete = _.find(u.posts, (eachPost) => eachPost._id === id);
          if (!postToDelete) {
            return res.redirect("/");
          }
          if (postToDelete && postToDelete.static_url) {
            try {
              let params = {
                Bucket: "frenly",
                Key: "feeds" + postToDelete.static_url.split("feeds")[1]
              };
              s3.deleteObject(params,(err,data) => {
                if(err) console.log(err,err.stack)
              });
            } catch (err) { 
              console.log("Post could not be deleted");
            };
          }
          u.posts = _.reject(u.posts, (eachPost) => eachPost._id === id);
          u.save((err, savedU) => {
            if (err) {
              throw err;
            }
            console.log("Post deleted");
            res.redirect("/");
          });
        });
      }
      break;
    default:
      res.send("What are you trynna do? (-_-)");
  }
});

router.get("/upload", function(req, res, next) {
  res.render("upload/file-upload", {
    title: req.app.conf.name,
    user: req.session.user
  });
});

router.post("/upload", upload.single("filetoupload"), function(req, res, next) {
  db.findOne({ id: req.session.user.id }).exec((err, u) => {
    u.posts.push({
      _id: guid.raw(),
      author: req.session.user.username,
      authorID: req.session.user.id,
      static_url: (req.file) ? req.file.location : null,
      caption: req.body.caption,
      category: req.body.type,
      comments: [],
      likes: [],
      type: (req.file) ? (req.file.originalname.split(".").pop().toLowerCase()) : null,
      createdAt: new Date(),
      lastEditedAt: new Date()
    });
    u.save((err, savedU) => {
      if (err) {
        throw err;
      }
      console.log("Post saved");
      res.redirect("/");
    });
  });
});

// router.post("/upload", formParser, function(req, res, next) {
//   // Generate a random id
//   var random_id = guid.raw();
//   var final_location = null, mimeType;
//   if (req.files.filetoupload.name) {
//     // Assign static_url path
//     var oldpath = req.files.filetoupload.path;
//     console.log(req.files.filetoupload.name);
//     var type = req.files.filetoupload.name.split(".")[req.files.filetoupload.name.split(".").length - 1].toLowerCase();
//     if (file_types.indexOf(type) < 0) {
//       return res.status(403).render("error", {
//         error: new Error("Only images and videos are allowed for upload!")
//       });
//     }
//     var newpath = path.join(
//       __dirname,
//       `../public/feeds/${req.session.user.username}_${random_id}.${type}`
//     );
//     final_location = `/feeds/${req.session.user.username}_${random_id}.${type}`;

//     console.log(
//       `${oldpath} - OldPath\n ${newpath} - Newpath\n ${final_location} - DiskLocation\n`
//     );
//     // Finally upload the file to disk and save the feed to users profile.
//     mimeType = mime.lookup(req.files.filetoupload.name).split("/")[1];
//     mv(oldpath, newpath, function(err) {
//       console.log("moving files");
//     });
//   }
  
//   db.findOne({ id: req.session.user.id }).exec((err, u) => {
//     u.posts.push({
//       _id: random_id,
//       author: req.session.user.username,
//       authorID: req.session.user.id,
//       static_url: final_location,
//       caption: req.body.caption,
//       category: req.body.type,
//       comments: [],
//       likes: [],
//       type: mimeType,
//       createdAt: new Date(),
//       lastEditedAt: new Date()
//     });
//     u = new db(u);
//     u.save((err) => {
//       if (err) {
//         throw err;
//       }
//       console.log("Post saved");
//       // Redirect back after the job is done.
//       res.redirect("/");
//     });
//   });
// });

module.exports = router;
