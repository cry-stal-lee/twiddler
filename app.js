$(document).ready(function(){
  // Select already existing elements

  // Create new HTML elements
  var $app = $('#app');
  var $title = $('<header><h1 class="hoverable">twiddler</h1></header>');

  var $newTweedFormContainer = $('<div id="new-tweed-form-container"></div>');
  var $newTweedForm = $('<form id="new-tweed-form"></form>');
  $newTweedForm.append('<label for="username">Hello <strong>@</strong></label><input type="text" class="" id="username" name="username" placeholder="[your handle]" maxlength="25"></input>, ');
  $newTweedForm.append('<label for="message">what\'s on your mind?</label>')
  $newTweedForm.append('<textarea class="" name="message" id="message" maxlength="300" placeholder="[your thoughts here]"></textarea>');
  $newTweedFormContainer.append($newTweedForm);

  var $tweedItContainer = $('<div id="tweed-it-container"></div>')
  var $tweedIt = $('<input type="submit" class="hoverable" form="new-tweed-form" value="tweed it &#8594" id="tweed-it" disabled="true"></input>');
  $tweedItContainer.append($tweedIt, '<span id="remaining"><span id="remainingChars">300</span> chars remaining</span>');

  var $newTweedsContainer = $('<div id="new-tweeds-container"></div>');
  var $newTweeds = $('<span id="new-tweeds"></span>').text('0 new tweeds');
  var $updateFeed = $('<button id="update-feed" class="hoverable">&#8635 update feed</button>');
  $newTweedsContainer.append($newTweeds, $updateFeed);

  var $feed = $('<div id="feed"></div>');

  var $creditWrapper = $('<div id="credit-wrapper"></div>')
  var $credit = $('<a id="credit" class="hoverable" href="https://github.com/cry-stal-lee"><h2>crystal lee</h2></a>');

  var $scrollToTop = $('<a class="scrollToTop hide hoverable" href=""></a>');
  $scrollToTop.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6"><path d="M12 6H0l6-6z"/></svg>');

  var $menu = $('<div class="menu"></div>');
  var $friendsList = $('<ul id="friends-list" class="friends-list">Friends List</ul>');
  var $menuButton = $('<button class="menu-button hoverable"></button>');
  $menuButton.append('<span class="line line-left line-before"></span><span class="line line-middle"></span><span class="line line-right line-before line-right-before"></span>');
  $menu.append($friendsList);

  var cursor = $('.cursor');

  // Create event handler functions
  var renderFeed = function(user) {
    $feed.html('');
    newTweeds = 0;
    refreshNewTweeds();
    if (user) {
      var streamSource = streams.users[user];
      $newTweedFormContainer.fadeOut();
      $tweedItContainer.fadeOut();
      $newTweeds.fadeOut();
    } else {
      var streamSource = streams.home;
      $newTweedFormContainer.fadeIn();
      $tweedItContainer.fadeIn();
      $newTweeds.fadeIn();
    }
    var index = streamSource.length - 1;
    while(index >= 0){
      var tweet = streamSource[index];
      var $tweet = renderTweet(tweet).hide();
      $tweet.appendTo($feed);
      $tweet.css('opacity', 0).slideDown('slow').animate(
        { opacity: 1 },
        { queue: false, duration: 'slow' }
      );
      index -= 1;
    }
    renderFriendsList();
    resetMessage();
  };

  var resetMessage = function() {
    $('#message').val('');
    $('#remainingChars').text($('#message').attr('maxlength'));
    $('#tweed-it').prop('disabled', true);
    $('#message').css("height", "58px");
  }

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
      $updateFeed.html('&#8592; back');
      $updateFeed.addClass('back');
    }
    renderFeed(user);
  }

  var renderTweet = function(tweet) {
    var $tweet = $('<div class="tweet"></div>');
    var $profilePhoto = $('<img class="profile-photo"></img>').attr('src', tweet.profilePhotoURL);
    var $user = $('<span class="username hoverable"></span>').text('@' + tweet.user).on({
      click: function() {
        handleUsernameClick(tweet.user)
      }
    });
    var $message = $('<p class="message"></p>').text(tweet.message);
    var $timestamp = $('<span class="timestamp"></span>').html(' &bull; ' + jQuery.timeago(tweet.created_at));

    var $userTime = $('<span class="user-time"></span>');
    $userTime.append($user, $timestamp);

    var $iconContainer = $('<div class="icon-container"></div>')
    var $comment = $('<i class="fas fa-comment icon comment"></i>');
    var $retweet = $('<i class="fas fa-retweet icon retweet"></i>');
    var $like = $('<i class ="fas fa-heart icon like"></i>');
    var $share = $('<i class="fas fa-share icon share"></i>');
    var $hiddenIcon = $('<i class="fas fa-share icon share hide"></i>');
    $iconContainer.append($comment, $retweet, $like, $share, $hiddenIcon);

    $tweet.append($profilePhoto, $userTime, $message, $iconContainer);
    return $tweet;
  };

  var refreshNewTweeds = function() {
    $newTweeds.text('[ ' + newTweeds + ' new tweeds ]');
    setTimeout(refreshNewTweeds, 1000);
  };

  var scrollFunc = function() {
    var y = window.scrollY;
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

  var magnifyCursor = (function(e) {
    cursor.css('transform', 'scale(1.8)');
    cursor.css('background-color', '#ac9a6f');
    cursor.css('box-shadow', '0 0 5px 0 rgb(172 154 111 / 0.5)');
  });

  var restoreCursor = (function(e) {
    cursor.css('transform', 'scale(1)');
    cursor.css('background-color', 'transparent');
    cursor.css('box-shadow', '0 0 20px 0 rgb(172 154 111 / 0.5)');
  });

    // Append new HTML elements to the DOM
    $title.appendTo($app);
    $newTweedFormContainer.appendTo($app);
    $tweedItContainer.appendTo($app);
    $newTweedsContainer.appendTo($app);
    $feed.appendTo($app);
    $menuButton.appendTo($app);
    $menu.appendTo($app);
    $credit.appendTo($creditWrapper)
    $creditWrapper.appendTo($app);
    $scrollToTop.appendTo($app);

  // Set event listeners (providing appropriate handlers as input)
  $title.on("click", function() {
    if ($updateFeed.hasClass('back')) {
      $updateFeed.removeClass('back');
      $updateFeed.html('&#8635 update feed');
    }
    renderFeed();
  });

  $updateFeed.on("click", function() {
    if ($updateFeed.hasClass('back')) {
      $updateFeed.removeClass('back');
      $updateFeed.html('&#8635 update feed');
    }
    renderFeed();
  });

  $tweedIt.on("click", function(event) {
    event.preventDefault();
    restoreCursor();
    var tweet = {};
    tweet.user = $('#username').val();
    tweet.message = $('#message').val();
    tweet.profilePhotoURL = './assets/img/default.png';
    tweet.created_at = new Date();
    addTweet(tweet);
    renderFeed();
  });

  window.addEventListener("scroll", scrollFunc);

  $scrollToTop.on("click", function(event) {
    event.preventDefault();
    scrollToTop();
  });

  $('#username, #message').on("keyup", function(event) {
    var length = $('#message').val().length;
    var nameLength = $('#username').val().length;
    var maxLength = $('#message').attr("maxlength");
    var remaining = maxLength-length;
    $('#remainingChars').text(remaining);
    if (length !== 0 && nameLength !== 0) {
      $('#tweed-it').prop('disabled', false);
    } else {
      $('#tweed-it').prop('disabled', true);
    };
  });

  $('.menu-button').on("click", function(x) {
    $(this).toggleClass("change");
    $(".menu").animate({
      height: "toggle",
      opacity: "toggle"
    }, "slow");
    $('.line').toggleClass("dark-blue-bg");
    $('.line').toggleClass("line-before", "line-right-before");
    $('.line-left').toggleClass("line-before");
    $('.line-right').toggleClass("line-before", "line-right-before");
  });

  $('.menu-button').on("mouseenter", function(x) {
    if (!$(this).hasClass("change")) {
      $('.line-left').removeClass("line-before");
      $('.line-right').removeClass("line-before", "line-right-before");
    }
  })

  $('.menu-button').on("mouseleave", function(x) {
    if (!$(this).hasClass("change")) {
    $('.line-left').addClass("line-before");
    $('.line-right').addClass("line-before", "line-right-before");
    }
  })

  $(window).mousemove(function(e) {
      cursor.css({
          top: e.clientY - cursor.height() / 2,
          left: e.clientX - cursor.width() / 2
      });
  });

  $(window)
      .mouseleave(function() {
          cursor.css({
              opacity: "0"
          });
      })
      .mouseenter(function() {
          cursor.css({
              opacity: "1"
          });
      });

  $('.hoverable').on({
    mouseenter: magnifyCursor,
    mouseleave: restoreCursor
  });

  $("ul").on("mouseenter", "li", magnifyCursor);
  $("ul").on("mouseleave", "li", restoreCursor);

  $feed.on("mouseenter", ".username", magnifyCursor);
  $feed.on("mouseleave", ".username", restoreCursor);

  // Autoexpand and shrink text area
  $("textarea").each(function () {
    this.setAttribute("style", "height:" + (this.scrollHeight) + "px; overflow-y:hidden;");
  }).on("input", function () {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
  });

  // Render initial feed, friends list, and new tweeds
  renderFeed();
});

window.isItBeautifulYet = true;