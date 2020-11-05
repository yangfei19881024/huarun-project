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
  

});