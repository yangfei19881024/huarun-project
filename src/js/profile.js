//profile

$ (function () {
  PROFILE = new profile ();
});

var profile = function () {
  this.scrollH;
  this.swipDist = 0;
  this.swipTimerID;

  this.setPageTop ();
  this.setClose ();
  //if(device=="sp"){
  this.setScroll ();
  //}

  var my = this;
  $ (window).resize (function () {
    my.resize ();
  });

  if (device == 'sp') {
    $ ('#profile .oldSite').hide ();
    $ ('#profile .msg').css ({
      'padding-bottom': '0px',
      'border-bottom': 'none',
    });
  }
};

/*---------Reset---------*/
profile.prototype.reset = function () {
  $ ('#profile .innerBlock').css ('top', '0px');
};

/*---------Resize---------*/
profile.prototype.resize = function () {
  var my = this;
  this.scrollH =
    $ ('#profile .innerBlock').height () - $ ('#profile').height () + 70;
  if (deviceDtl == 'iphone') my.scrollH += 50;
  if (deviceDtl == 'ipad') my.scrollH += 200;
  // if($("#profile .innerBlock").position().top>0) $("#profile .innerBlock").stop().animate({top:0},200,"swing");
  // if($("#profile .innerBlock").position().top<-my.scrollH) $("#profile .innerBlock").stop().animate({top:-my.scrollH},200,"swing");
};

/*---------Open---------*/
profile.prototype.open = function () {
  var my = this;
  $ ('#profile .innerBlock').css ('top', '0px');
  $ ('#profile').fadeIn (300, function () {
    my.scrollH =
      $ ('#profile .innerBlock').height () - $ ('#profile').height () + 70;
    if (deviceDtl == 'iphone') my.scrollH += 50;
    if (deviceDtl == 'ipad') my.scrollH += 200;
    //console.log("scrollH : "+my.scrollH);
  });
};

/*---------scroll---------*/
profile.prototype.setScroll = function () {
  var my = this;
  var swipeY1 = 0;
  var swipeY2 = 0;
  $ ('#profile .innerBlock').on (onStart, function (ev) {
    if (device == 'pc') swipeY1 = ev.clientY;
    if (device == 'sp') swipeY1 = ev.touches[0].clientY;
    $ (this).on (onMove, function (ev) {
      ev.preventDefault ();
      if (device == 'pc') swipeY2 = ev.clientY;
      if (device == 'sp') swipeY2 = ev.touches[0].clientY;
      my.swipDist = swipeY1 - swipeY2;
      swipeY1 = swipeY2;
      var topPosition = $ (this).position ().top;
      $ (this).css ('top', topPosition - my.swipDist + 'px');
    });
    $ (this).on (onEnd, function (ev) {
      my.animateMouseFinish ($ (this));
      swipeY1 = 0;
      swipeY2 = 0;
      $ (this).off (onMove);
      $ (this).off (onEnd);
      if ($ (this).position ().top > 0)
        $ (this).stop ().animate ({top: 0}, 300, 'swing');
      if ($ (this).position ().top < -my.scrollH)
        $ (this).stop ().animate ({top: -my.scrollH}, 300, 'swing');
    });
  });

  var mousewheelevent = 'onwheel' in document
    ? 'wheel'
    : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
  $ ('#profile .innerBlock').on (mousewheelevent, function (ev) {
    clearTimeout (my.swipTimerID);
    ev.preventDefault ();
    my.swipDist = ev.originalEvent.deltaY
      ? -ev.originalEvent.deltaY
      : ev.originalEvent.wheelDelta
          ? ev.originalEvent.wheelDelta
          : -ev.originalEvent.detail;
    /*if(browser == "firefox") */ my.swipDist *= 10;
    if (my.swipDist > 0) {
      my.swipDist = Math.min (my.swipDist, 200);
      my.swipDist = Math.max (my.swipDist, 40);
    } else if (my.swipDist < 0) {
      my.swipDist = Math.min (my.swipDist, -40);
      my.swipDist = Math.max (my.swipDist, -200);
    }

    //console.log(my.swipDist);
    var topPosition = $ (this).position ().top;
    if (
      (topPosition <= 0 && topPosition >= -my.scrollH) ||
      (topPosition > 0 && my.swipDist < 0) ||
      (topPosition < -my.scrollH && my.swipDist > 0)
    ) {
      $ (this).css ('top', topPosition + my.swipDist * 0.2 + 'px');
      /*$(this).stop().animate({top:topPosition + my.swipDist*1},100,"swing",function(){
				topPosition = $(this).position().top;
				if(topPosition>0) $(this).stop().animate({top:0-1},200,"swing");
				if(topPosition<-my.scrollH) $(this).stop().animate({top:-my.scrollH+1},200,"swing");
			});*/
    } else if (topPosition > 0) {
      $ (this).stop ().animate ({top: 0 - 1}, 200, 'swing');
    } else if (topPosition < -my.scrollH) {
      $ (this).stop ().animate ({top: -my.scrollH + 1}, 200, 'swing');
    }
    /*else{
			if(topPosition>0) $(this).stop().animate({top:0},200,"swing");
			if(topPosition<-my.scrollH) $(this).stop().animate({top:-my.scrollH},200,"swing");
		}*/

    //my.animateMouseFinish($(this));
  });
};

//スワイプの余韻
profile.prototype.animateMouseFinish = function (elem) {
  var my = this;
  my.swipTimerID = setTimeout (function () {
    var topPosition = elem.position ().top;

    if (
      Math.abs (my.swipDist) > 1 &&
      topPosition < 0 &&
      topPosition > -my.scrollH
    ) {
      my.swipDist *= 0.97;
      elem.css ('top', topPosition - my.swipDist + 'px');
      my.animateMouseFinish (elem);
    } else {
      clearTimeout (my.swipTimerID);
      if ($ (this).position ().top > 0)
        $ (this).stop ().animate ({top: 0}, 200, 'swing');
      if ($ (this).position ().top < -my.scrollH)
        $ (this).stop ().animate ({top: -my.scrollH}, 200, 'swing');
    }
  }, 1000 / 60);
};

/*---------pageTop---------*/
profile.prototype.setPageTop = function () {
  $ ('#profile .innerBlock .pagetop').on (onEnd, function () {
    $ ('#profile .innerBlock').stop ().animate ({top: 0}, 500, 'swing');
  });
};

/*---------Close---------*/
profile.prototype.setClose = function () {
  var my = this;
  $ ('#profile .innerBlock header .return').on (onEnd, function () {
    $ ('#profile .innerBlock').stop ().animate ({top: 0}, 100);
    $ ('#profile').stop ().fadeOut (300, function () {
      my.reset ();
    });
    SOUND.playReturn ();
  });
};
