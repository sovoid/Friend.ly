require("dotenv").config();
const PersonalityInsightsV3 = require("ibm-watson/personality-insights/v3");
const ToneAnalyzerV3 = require("ibm-watson/tone-analyzer/v3");
const { IamAuthenticator } = require("ibm-watson/auth");
const personalityInsights = new PersonalityInsightsV3({
  authenticator: new IamAuthenticator({ apikey: process.env.WATSON_PERSONALITY_API_KEY }),
  version: process.env.WATSON_API_VERSION,
  url: process.env.WATSON_PERSONALITY_URL
});
const toneAnalyzer = new ToneAnalyzerV3({
  authenticator: new IamAuthenticator({ apikey: process.env.WATSON_TONE_API_KEY }),
  version: process.env.WATSON_API_VERSION,
  url: process.env.WATSON_TONE_URL
});
const _ = require("underscore");
const ta = require("time-ago");
const messageObj = {
  Anger: {
    large: "Angry? Grab a snickers 🍫🍫...",
    small: "because you aren't you when angry."
  },
  Fear: {
    large: "Nothing is scarier than a 🕷...",
    small: "and a cockroach that can fly."
  },
  Sadness: {
    large: "When life gets you down, just keep swimming 🏊🏻‍♂️🏊🏻‍♀️...",
    small: "and singing baby shark todoodo 🦈."
  },
  Joy: {
    large: "Seems like you've got galaxies inside of you ✨✨...",
    small: "keep smiling 😇."
  },
  Disgust: {
    large: "Disgusted? Imagine putting your hand under the table and...",
    small: "touching someone else's old gum 🤮."
  },
  Neutral: {
    large: "Seems like you haven't been upto much lately...🧐",
    small: "make a friend.ly post now!"
  }
};

/**
 *
 * @param {Object} TwitterClient
 * @param {String} twitterhandle
 * @param {Function} cb
 */
function getUserTimeLine(TwitterClient, twitterhandle, cb) {
  TwitterClient.get(
    "statuses/user_timeline",
    {
      screen_name: twitterhandle,
      count: 1000
    },
    function(err, data, res) {
      var text = "";
      for (var i = 0; i < data.length; i++) {
        text = text + data[i].text + "\n";
      }

      personalityInsights.profile(
        {
          content: text,
          contentType: "text/plain",
          consumptionPreferences: true
        },
        function(error, response) {
          if (error) {
            return cb(error, null);
          }
          var result = JSON.stringify(response.result, null, 2);
          var big5 = JSON.parse(result);
          var insightObj = {
            openess: big5.personality[0].percentile,
            conscientiousness: big5.personality[1].percentile,
            extraversion: big5.personality[2].percentile,
            agreeableness: big5.personality[3].percentile,
            neuroticism: big5.personality[4].percentile
          };
          return cb(null, insightObj);
        }
      );
    }
  );
}

/**
 * 
 * @param {Object} user 
 */
function getUserTone(user, cb) {
  var lastPost = user.posts.length ? user.posts[user.posts.length - 1] : null;
  if (lastPost) {
    var timeago = ta.ago(lastPost.createdAt);
    if (!timeago.includes("days") || !timeago.includes("years")) {
      toneAnalyzer.tone(
        {
          toneInput: lastPost.caption,
          contentType: "text/plain"
        },
        function(err, tone) {
          if (err) {
            console.err(err, err.stack);
            return cb(err, null);
          } else {
            var emotions = tone.result.document_tone.tone_categories[0].tones;
            var mood = _.max(emotions, (emotion) => emotion.score);
            if (mood.score !== 0) {
              return cb(null, messageObj[mood.tone_name]);
            } else {
              return cb(null, messageObj.Neutral);
            }
          }
        }
      );
    } else {
      return cb(null, messageObj.Neutral);
    }
  } else {
    return cb(null, messageObj.Neutral);
  }
}

module.exports = {
  getUserTimeLine,
  getUserTone,
};
