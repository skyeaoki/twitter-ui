# twitter-ui
Displays a user's most recent tweets, friends, and messages. In order for this UI to work please ensure you have sent or received at least 5 twitter direct messages in the past 30 days.

To use with your twitter account please include a config.js file in the root directory with this info:

  const authentication = { consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: '' };

module.exports.authentication = authentication;
