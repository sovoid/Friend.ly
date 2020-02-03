require("dotenv").config();
const PersonalityInsightsV3 = require("ibm-watson/personality-insights/v3");
const { IamAuthenticator } = require("ibm-watson/auth");
const personalityInsights = new PersonalityInsightsV3({
  authenticator: new IamAuthenticator({ apikey: process.env.WATSON_API_KEY }),
  version: process.env.WATSON_API_VERSION,
  url: process.env.WATSON_URL
});
           
/**
 * 
 * @param {Object} TwitterClient
 * @param {String} twitterhandle 
 * @param {Function} cb 
 */
function getUserTimeLine(TwitterClient ,twitterhandle, cb) {
  TwitterClient.get("statuses/user_timeline", { screen_name: twitterhandle,
  count: 1000}, function(err, data, res) {
  var text="";
  for (var i = 0; i < data.length ; i++) {
    text=text+data[i].text+"\n";
  }
  
  personalityInsights.profile({
    content: text,
    contentType: "text/plain",
    consumptionPreferences: true
  }, function(error, response) {
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
  });
  })
}


module.exports = getUserTimeLine
