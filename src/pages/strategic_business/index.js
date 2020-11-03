/* eslint-disable */
// import '@babel/polyfill'
// import './about.scss'
// import '../../common/css/com.scss'
// import $ from 'jquery'

var oUl = document.getElementById('scale-line');
/* 因为是60个刻度嘛，我们就创建60个li，并设置它们的旋转角度 */
for (var i=0;i<60;i++){   
   var oLi = document.createElement('li');   
    /* 因为i是从0~60，而每个刻度的旋转角度360°÷60=6°，所以每个刻度的旋转角度就是i*6°  */
   oLi.style.webkitTransform = 'rotate('+ i*6 +'deg)'; 
   oUl.appendChild(oLi);
}

var tUl = document.getElementById('scale-time');
/* 因为是60个刻度嘛，我们就创建60个li，并设置它们的旋转角度 */
for (var i=0;i<26;i++){   
   var oLi = document.createElement('li');
   var oSpan = document.createElement('span')   

    /* 因为i是从0~60，而每个刻度的旋转角度360°÷60=6°，所以每个刻度的旋转角度就是i*6°  */
   var angle = i*13.8-90
   oLi.style.webkitTransform = 'rotate('+ angle +'deg)'; 
   oSpan.innerHTML = 1994+i
   oLi.appendChild(oSpan)
   tUl.appendChild(oLi);
}

// 获取屏幕高度
var $window = $(window)
var window_height = $window.height();

// $('.circle, #scale-line').height(window_height)
// var half_height = Math.floor(window_height / 2)
// $('#scale-line li').css({
//    left: half_height + 'px',
//    '-webkit-transform-origin': "0 "+half_height + 'px'
// })

// 小滚轮滚动

// $('.pan-container').on('mousewheel', function(event) {
//    console.log(event.deltaX, event.deltaY, event.deltaFactor);
// });

var a = 0;
var count = 0;
var flag = false;
var preA = 0
$(".pan-container").mousedown(function(event){
   // alert('1')
   count++;
   if( count == 7 ) count = 0;
   console.log("count: "+count)
   preX = event.clientX;
   preY = event.clientY;
   //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
   preAngle = Math.atan2(preY - 150, preX - 150);
   //移动事件
   $("html").mousemove(function(event){
      console.log("--->")
      curX = event.clientX;
      curY = event.clientY;
      //计算当前点击的点与圆心(150,150)的X轴的夹角(弧度) --> 上半圆为负(0 ~ -180), 下半圆未正[0 ~ 180]
      var curAngle = Math.atan2(curY - 150, curX - 150);
      transferAngle = curAngle - preAngle;
      a += (transferAngle * 180 / Math.PI);
      console.log(a - preA)
      // $('.pan-container').rotate(a)

      if( a - preA > 8 ) {
         flag = true
         var angle = (count*50)
         $('.pan-container').css({
            'transform': `rotate(${angle}deg)`
         })
         var angle2 = (count*50)
         $('#scale-brand').css({
            'transform': `rotate(${angle2}deg)`
         })
      }else{
         flag = false
      }

      // for( var i = 1 ; i <= 8 ; i++ ){
      //    $("#m"+i).rotate(-a);
      // }
      preX = curX;
      preY = curY;
      preAngle = curAngle;
   });
   //释放事件
   $("html").mouseup(function(event){
      preA = a;
      $("html").unbind("mousemove");
      if(!flag) {
         count--;
      }
      // console.log('count-->'+ count)
      $('.content-item').hide()
      $('.content-item').eq(count).fadeIn()
   });
});


$('.swiper').slick();



