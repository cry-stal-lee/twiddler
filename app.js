$(document).ready(function(){
  // Select already existing elements

  // Create new HTML elements
  var $app = $('#app');
  var $title = $('<header><h1>Twiddler</h1></header>');

  var $friendsList = $('<ul id="friends-list">Friends List</ul>');

  var $newTweetForm = $('<form id="new-tweet-form"></form>');
  $newTweetForm.append('<label for="username">Hello @</label><input type="text" id="username" name="username"></input><br>');
  $newTweetForm.append('<label for="message">what\'s on your mind?<br></label><input type="text" id="message" name="message"></input><br>');
  var $tweedIt = $('<input type="submit" value="Tweed it!" id="tweedIt"></input>');
  $newTweetForm.append($tweedIt);

  var $newTweeds = $('<span id="new-tweeds"></span>').text('0 new tweeds');

  var $updateFeed = $('<button id="update-feed">Update Feed</button>');

  var $feed = $('<div id="feed"></div>');

  var $credit = $('<a id="credit" href="https://github.com/cry-stal-lee">crystal lee</a>');

  var $scrollToTop = $('<a class="scrollToTop hide" href=""></a>');
  $scrollToTop.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6"><path d="M12 6H0l6-6z"/></svg>');

  // Create event handler functions
  var renderFeed = function(user) {
    $feed.html('');
    newTweeds = 0;
    refreshNewTweeds();
    if (user) {
      var streamSource = streams.users[user];
    } else {
      var streamSource = streams.home;
    }
    var index = streamSource.length - 1;
    while(index >= 0){
      var tweet = streamSource[index];
      var $tweet = renderTweet(tweet);
      $tweet.appendTo($feed);
      index -= 1;
    }
    renderFriendsList();
  };

  var renderFriendsList = function() {
    $friendsList.html('');
    let sortedUsers = Object.keys(streams.users).sort();
    sortedUsers.forEach(function(user) {
      var $friend = $('<li class="friend"></li>').text('@' + user).on("click", function() {
        handleUsernameClick(user);
      });
      $friend.appendTo($friendsList);
    })
  };

  var handleUsernameClick = function(user) {
    if (!$updateFeed.hasClass('back')) {
      $updateFeed.text('Back');
      $updateFeed.addClass('back');
    }
    renderFeed(user);
  }

  var renderTweet = function(tweet) {
    var $tweet = $('<div class="tweet"></div>');
    var $profilePhoto = $('<img class="profile-photo"></img>').attr('src', tweet.profilePhotoURL);
    var $user = $('<span class="username"></span>').text('@' + tweet.user).on("click", function() {
      handleUsernameClick(tweet.user)});
    var $message = $('<p class="message"></p>').text(tweet.message);
    var $timestamp = $('<span class="timestamp"></span>').text(jQuery.timeago(tweet.created_at));
    var $comment = $('<i class="fas fa-comment icon comment"></i>');
    var $retweet = $('<i class="fas fa-retweet icon retweet"></i>');
    var $like = $('<i class ="fas fa-heart icon like"></i>');
    var $share = $('<i class="fas fa-share icon share"></i>');
    $tweet.append($profilePhoto, '<br>', $user, $message, $timestamp,
        '<br>', $comment, $retweet, $like, $share);
    return $tweet;
  };

  var refreshNewTweeds = function() {
    $newTweeds.text(newTweeds + ' new tweeds');
    setTimeout(refreshNewTweeds, 1000);
  };

  var scrollFunc = function() {
    // Get the current scroll value
    var y = window.scrollY;

    // If the scroll value is greater than the window height, let's add a class to the scroll-to-top button to show it!
    if (y > 0) {
      $scrollToTop.removeClass('hide').addClass('show');
    } else {
      $scrollToTop.removeClass('show').addClass('hide');
    }
  };

  var scrollToTop = function() {
    var c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, c - c / 10);
    }
  };

  // Set event listeners (providing appropriate handlers as input)
  $title.on("click", function() {
    if ($updateFeed.hasClass('back')) {
      $updateFeed.removeClass('back');
      $updateFeed.text('Update Feed');
    }
    renderFeed();
  });

  $updateFeed.on("click", function() {
    if ($updateFeed.hasClass('back')) {
      $updateFeed.removeClass('back');
      $updateFeed.text('Update Feed');
    }
    renderFeed();
  });

  $tweedIt.on("click", function() {
    var tweet = {};
    tweet.user = $('#username').val();
    tweet.message = $('#message').val();
    tweet.profilePhotoURL = './assets/img/default.png';
    tweet.created_at = new Date();
    addTweet(tweet);
    renderFeed();
    return false;
  });

  window.addEventListener("scroll", scrollFunc);

  $scrollToTop.on("click", function(event) {
    event.preventDefault();
    scrollToTop();
  });

  // Append new HTML elements to the DOM
  $title.appendTo($app);
  $newTweetForm.appendTo($app);
  $newTweeds.appendTo($app);
  $updateFeed.appendTo($app);
  $feed.appendTo($app);
  $friendsList.appendTo($app);
  $credit.appendTo($app);
  $scrollToTop.appendTo($app);

  // Render initial feed, friends list, and new tweeds
  renderFeed();
});

window.isItBeautifulYet = true;

