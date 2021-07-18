$(document).ready(function(){

  // Select already existing elements

  // Create new HTML elements
  var $app = $('#app');
  var $title = $('<h1>Twiddler</h1>');
  var $updateFeed = $('<button id="update-feed">Update Feed</button>');
  var $feed = $('<div id="feed"></div>');

  // Create event handler functions
  var renderFeed = function() {
    $feed.html('');
    var index = streams.home.length - 1;
    while(index >= 0){
      var tweet = streams.home[index];
      var $tweet = renderTweet(tweet);
      $tweet.appendTo($feed);
      index -= 1;
    }
  };

  var renderTweet = function(tweet) {
    var $tweet = $('<div class="tweet"></div>');
    var $profilePhoto = $('<img class="profile-photo"></img>').attr('src', tweet.profilePhotoURL);
    var $user = $('<span class="username"></span>').text('@' + tweet.user);
    var $message = $('<p class="message"></p>').text(tweet.message);
    var $timestamp = $('<span class="timestamp"></span>').text(tweet.created_at);
    var $comment = $('<img class="icon comment"></img>').attr('src', './assets/icons/placeholder.png');
    var $retweet = $('<img class="icon retweet"></img>').attr('src', './assets/icons/placeholder.png');
    var $like = $('<img class="icon like"></img>').attr('src', './assets/icons/placeholder.png');
    var $share = $('<img class="icon share"></img>').attr('src', './assets/icons/placeholder.png');
    $tweet.append($profilePhoto, '<br>', $user, $message, $timestamp,
        '<br>', $comment, $retweet, $like, $share);
    return $tweet;
  };

  // Set event listeners (providing appropriate handlers as input)
  $updateFeed.on("click", function(event) {
    renderFeed(event);
  });

  // Append new HTML elements to the DOM
  $title.appendTo($app);
  $updateFeed.appendTo($app);
  $feed.appendTo($app);

  // Render initial feed
  renderFeed();

});