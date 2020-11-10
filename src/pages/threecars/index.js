$(document).ready(function() {

  var $window = $(window);

  $('#three-cars').css({
    width: $window.width() + 'px',
    height: $window.height() + 'px',
  })

  var currentIndex = -1
  var globalTimmer
  $('.btns li').on('mouseover', function(event) {
    // $('.btns li').children('.unselect').addClass('active')
    // $('.btns li').children('.selected').removeClass('active')
    $('.btns li').children('.icon').removeClass('active')
    
    var index = $('.btns li').index(this)
    // $(this).children('.unselect').removeClass('active')
    // $(this).children('.selected').addClass('active')
    $(this).children('.icon').addClass('active')
  })
  $('.btns li').on('mouseout', function(event) {
    var index = $('.btns li').index(this)
    if (index != currentIndex) {
      // $(this).children('.unselect').addClass('active')
      // $(this).children('.selected').removeClass('active')
      $(this).children('.icon').removeClass('active')
      // $('.btns li').eq(currentIndex).children('.unselect').removeClass('active')
      // $('.btns li').eq(currentIndex).children('.selected').addClass('active')
      $('.btns li').eq(currentIndex).children('.icon').addClass('active')
    }
  })
  $('.btns li').on('click', function(event) {
    var index = $('.btns li').index(this)
    currentIndex = index
    $('.btns li').children('.unselect').addClass('active')
    $('.btns li').children('.selected').removeClass('active')
    $(this).children('.selected').addClass('active')
    $(this).children('.unselect').removeClass('active')
    $('.imgs div').hide()
    $('.imgs div').eq(index).show()
    startSwitch(index)
    startPath(index)
  })
  
  var startSwitch = function(index) {
    globalTimmer && clearInterval(globalTimmer)
    var imgArr = [[[31, 31, 31], [32, 32, 32]], [[31, 31, 31], [32, 32, 32]], [[31, 31, 31], [32, 32, 32]]]
    var leftArr = imgArr[index][0]
    var rightArr = imgArr[index][1]
    var currentIndex = 0
    globalTimmer = setInterval(function() {
      currentIndex ++
      if(currentIndex >= leftArr.length) {
        currentIndex = 0
      }
      $('.imgs div').eq(index).hide()
      $('.imgs div').eq(index).children('img').eq(0).attr('src', '../../images/threecars/'+leftArr[currentIndex]+'.png')
      $('.imgs div').eq(index).children('img').eq(1).attr('src', '../../images/threecars/'+rightArr[currentIndex]+'.png')
      setTimeout(function() {
        $('.imgs div').eq(index).show()
      }, 500)
    }, 4000)
  }
  
  var startShow = function(index, start, end) {
    var span = $('.marks>div').eq(index).children('div').children('span')[0]
    console.info(span)
    var value = start
    var duration = 5
    var interval = (end - start)/10/5
    var stepper = setInterval(function() {
      if(value < end) {
        value += 10
        if(value > end) {
          value = end
        }
        span.innerHTML = value
      } else {
        clearInterval(stepper)
      }
    }, interval)
  }
  
  var startPath = function(index) {
    var baseSvg = $('.basePath').children()[index];
    $('.basePath').children().hide()
    $(baseSvg).show()
    var svg = $('.path').children()[index];
    var path = $(svg).children('path')[0];
    var pathLength = path.getTotalLength();
    var pen = $(svg).children('image')[0];
    var ratio = svg.getBoundingClientRect().width / svg.getBBox().width;
    
    path.setAttribute("stroke-dasharray", "0 " + pathLength);
    $('.path').children().hide()
    $(svg).show()
    $('.marks>div').hide()
    $('.marks>div').eq(index).show()
    startShow(index, 0, 1254)
    
    var tween = createjs.Tween.
    get({length: 0 }, {loop: false }).
    to({length: pathLength }, 3000, createjs.Ease.signEase).
    addEventListener("change", function (event) {
      var length = event.target.target.length;
      var point = path.getPointAtLength(length);
    
      path.style.strokeDasharray = length + " " + pathLength;
      pen.style.transform = "translate(" + (point.x - 14) + "px," + (point.y - 10) + "px)";
    });
  }
})