const PersonalityInsightsV3 = require('ibm-watson/personality-insights/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
const personalityInsights = new PersonalityInsightsV3({
  authenticator: new IamAuthenticator({ apikey: 'wT_Y2y3fjSTgkQtMsf6C1REEEgmfiVlqggEzfSyZridJ' }),
  version: '2016-10-19',
  url: 'https://gateway-wdc.watsonplatform.net/personality-insights/api'
});
           
/**
 * 
 * @param {Object} TwitterClient
 * @param {String} twitterhandle 
 * @param {Function} cb 
 */
function getUserTimeLine(TwitterClient ,twitterhandle, cb) {
  TwitterClient.get('statuses/user_timeline', { screen_name: twitterhandle,
  count: 1000}, function(err, data, res) {
  var text="";
  for (var i = 0; i < data.length ; i++) {
    text=text+data[i].text+'\n';
  }
  
  personalityInsights.profile({
    content: text,
    contentType: 'text/plain',
    consumptionPreferences: true
  }, function(error, response) {
    if(error)
      return cb(error, null);
    result = JSON.stringify(response.result, null, 2)
    big5 = JSON.parse(result)
    var insightObj = {};
    insightObj.openess = big5.personality[0].percentile
    insightObj.conscientiousness = big5.personality[1].percentile
    insightObj.extraversion = big5.personality[2].percentile
    insightObj.agreeableness = big5.personality[3].percentile
    insightObj.neuroticism = big5.personality[4].percentile
    return cb(null, insightObj);
  });
  })
}


module.exports = getUserTimeLine
