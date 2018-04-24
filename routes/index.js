'use strict';

const express = require('express');
const router = express.Router();
const Twit = require('twit');
const config = require('../config.js');
const username = config.username;

// Set up Timeline variable
const timeline = {
  t1: {},
  t2: {},
  t3: {},
  t4: {},
  t5: {}
};

// Set up 'Following' variable
const following = {
  f1: {},
  f2: {},
  f3: {},
  f4: {},
  f5: {}
};

// Set up Direct Message variable
const directMessage = {
  d1: {},
  d2: {},
  d3: {},
  d4: {},
  d5: {}
};

// set up Twit api
const T = new Twit({
  consumer_key: config.authentication.consumer_key,
  consumer_secret: config.authentication.consumer_secret,
  access_token: config.authentication.access_token,
  access_token_secret: config.authentication.access_token_secret,
  timeout_ms: 60*1000  // optional HTTP request timeout to apply to all requests.
});

//Functions to format date/ time data
function formatDate(date) {
  return date.substr(0,11);
}

function formatDateAndTime(date) {
  return date.substr(0,19);
}

// Get 5 latest tweets
T.get('statuses/user_timeline', {user_id: username, count: 5}, function (err, data, response) {
  // Assign the data from the API pull to properties on the 'timeline' object
  // (Loop 5 times for the 5 tweets)
  for(let i = 1; i < 6; i++) {
    timeline["t"+i].name = data[i-1].user.name;
    timeline["t"+i].username = data[i-1].user.screen_name;
    timeline["t"+i].profilePic = data[i-1].user.profile_image_url;
    timeline["t"+i].tweet = data[i-1].text;
    timeline["t"+i].retweetCount = data[i-1].retweet_count;
    timeline["t"+i].likesCount = data[i-1].favorite_count;
    timeline["t"+i].time = formatDate(data[i-1].created_at);
    //timeline["t"+i].id = data[i-1].id;
  }
  if (err) {
    console.log(err);
  }
});

// Get 5 most recent friends that I'm following
T.get('friends/list', {user_id: username, count: 5}, function (err, data, response) {
  // Assign the data from the API pull to properties on the 'following' object
  for(let i = 1; i < 6; i++) {
    following["f"+i].name = data.users[i-1].name;
    following["f"+i].username = data.users[i-1].screen_name;
    following["f"+i].profilePic = data.users[i-1].profile_image_url;
  }
  if (err) {
    console.log(err);
  }
});

// Get the IDs of the 5 most recent direct Messages
T.get('direct_messages/events/list', {count: 5}, function (err, data, response) {
  for(let i = 1; i < 6; i++) {
    directMessage["d"+i].id = data.events[i-1].id;
  }

  // Get the details of the 5 most recent direct messages using the IDs
  for(let i = 1; i < 6; i++) {
    T.get('direct_messages/show', {id: directMessage["d"+i].id}, function (err, data, response) {
      directMessage["d"+i].senderName = data.sender.name;
      directMessage["d"+i].profilePic = data.sender.profile_image_url;
      directMessage["d"+i].text = data.text;
      directMessage["d"+i].time = formatDateAndTime(data.created_at);
      if (err) {
        console.log(err);
      }
    });
  }
});

// Render all the info to the root
router.get('/', (req, res) => {
  res.render('index', {timeline, following, directMessage});
});

module.exports = router;
