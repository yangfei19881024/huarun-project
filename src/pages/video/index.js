$(function(){
  initVideo()
  function initVideo() {
    var dp = new DPlayer({
        container: document.getElementById('dplayer'),
        screenshot: false,
        video: {
            url: 'https://h5.boqiicdn.com/hr/oceans.mp4',
            pic: '',
            thumbnails: '',
        }
    });
  }
  // 切换视频
  $('.video-menu-item-con').click(function(){
    initVideo(/**传递视频url**/)
  });


  var $window = $(window)
  $('.video-menu, .video-page').height($window.height())
  
  var $videoWidth = $(window).width() * 0.62;
  var $videoHeight = $videoWidth * 0.7;

  $('.dplayer-con').css({
    width: $videoWidth + 'px',
    height: $videoHeight + 'px',
    marginTop: ($window.height() - $videoHeight) / 2 + 'px',
    paddingTop: '30px',
    paddingLeft: '25px',
  });

  $("#dplayer").css({
    width: $videoWidth-50 + 'px',
    height: $videoHeight-60 + 'px',
  });

});