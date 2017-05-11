var streaming = require('./streamingTwitter.js');

module.exports = {
    options: {
        method: 'GET',
        url: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
        qs: {
            screen_name: "jpackel",
            count:'50'

        },
        json: true,
        headers: {
            "Authorization": "Bearer " + process.env.BEARER_TOKEN
        }
    }
}
