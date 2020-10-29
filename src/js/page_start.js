//デバイスチェック
var ua = window.navigator.userAgent.toLowerCase();
var device = "pc";
var deviceDtl = "pc";
var browser;
//alert(ua);

if(ua.indexOf("iphone")>=0 || ua.indexOf("ipad")>=0 || ua.indexOf("android")>=0){
	device = "sp";
}else if(ua.indexOf("macintosh")>=0 && 'ontouchend' in document){
	device = "sp";
}
if(ua.indexOf("iphone")>=0){
	deviceDtl = "iphone";
}else if(ua.indexOf("ipad")>=0){
	deviceDtl = "ipad";
}else if(ua.indexOf("android")>=0){
	deviceDtl = "android";
}
if(ua.indexOf("firefox") != -1){
	browser = "firefox";
}else if(ua.indexOf("chrome") != -1){
	browser = "chrome";
}else if(ua.indexOf("safari") != -1){
	browser = "safari";
}

//console.log(ua);




//イベント PC or SP
var onStart,onEnd,onMove;
if(device=="pc"){
	onStart = "mousedown";
	onEnd = "mouseup";
	onMove = "mousemove";
}else{
	onStart = "touchstart";
	onEnd = "touchend";
	onMove = "touchmove";
}



//page start

$(function(){
	 PAGE_START = new pageStart();
		
	no_scroll();
	
	var myDate = new Date();
	$("#logo .copyright span").text(myDate.getFullYear());
	
	//set_iPhoneHeightLayout(0);
	
});

	/*window.onfocus=function(){
		if((deviceDtl == "iphone" || deviceDtl == "ipad") && $(window).width()>$(window).height()){
			$("html,body").scrollTop(-70);
			$("html,body").delay(500).css("height",$(window).height()-50+"px");
		}
	};*/
	window.onload=function(){
		if((deviceDtl == "iphone" || deviceDtl == "ipad") && $(window).width()>$(window).height()){
			$("html,body").scrollTop(-70);
			$("html,body").delay(500).css("height",$(window).height()-50+"px");
		}
	};

//スクロール禁止
function no_scroll(){
	//PC用
	var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	$(document,"body,html").on(scroll_event,function(e){e.preventDefault();});		//全体をスクロール禁止
	//$("#profile .innerBlock").on(scroll_event,function(e){e.stopPropagation();});	//一部分をスクロール禁止解除
	//$("#search .innerBox .listBox").on(scroll_event,function(e){e.stopPropagation();});
	//SP用
	$("body,html,#contentAllWrapper").on('touchmove.noScroll', function(e) {e.preventDefault();});	//全体をスクロール禁止
	$("#logo,#sideway,#circle3d,#sortVertical,sortVertical .tranceCover, #search, #viewPhoto, #view360, #alert, #profile, #access").on('touchmove.noScroll', function(e) {e.preventDefault();});	//全体をスクロール禁止
	//$("#profile .innerBlock").on('touchmove.scroll',function(e){e.stopPropagation();});		//一部分をスクロール禁止解除
}

//スクロール復活用関数
function return_scroll(){
	//PC用
	var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	$(document,"body,html").off(scroll_event,function(e){e.preventDefault();});
	//SP用
	$(document,"body,html").off('.noScroll');
}


//windowリサイズ
/*$(window).resize(function(){
	set_iPhoneHeightLayout(100);
});*/

var iPhoneLayoutID;
function set_iPhoneHeightLayout(tm){
	if((deviceDtl == "iphone" || deviceDtl == "ipad") && $(window).width()>$(window).height()){
		clearTimeout(iPhoneLayoutID);
		iPhoneLayoutID = setTimeout(function(){
			//$("html,body").css("height","101%");
		},tm);
	}else if((deviceDtl == "iphone" || deviceDtl == "ipad") && $(window).width()<$(window).height()){
		clearTimeout(iPhoneLayoutID);
		iPhoneLayoutID = setTimeout(function(){
			//$("html,body").css("height","101%");
		},tm);
	}
}


//WebGL判定
var Detector = {
    webgl: (function () {
        try {
            var canvas = document.createElement('canvas');
            // 修正コード開始
            var webGLContext = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            return !!( window.WebGLRenderingContext && webGLContext && webGLContext.getShaderPrecisionFormat );
            // return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
            // 修正コード終了
        } catch (e) {
            return false;
        }
    })()
};

// test code
//alert(Detector.webgl);




var pageStart = function(){
	this.refFlag = false;		//外部サイトからの訪問か
	var my = this;
	//console.log(new THREE.WebGLRenderer().context.drawingBufferWidth);
	if(document.referrer.indexOf("baqueratta.com")>=0){
		this.refFlag = true;
	}
	
  var logoImage = new Image();
  logoImage.src = "images/baqueratta_logo.png";
  logoImage.onload = function(){
    $("#logo").fadeIn(500);
    //ロゴと横向きを表示
      $("#logo").delay(2000).fadeOut(500,function(){
        if(device=="sp" && Detector.webgl){
          $("#sideway").css({"opacity":0,"display":"block"}).animate({opacity:1},500,"linear");
        }else if(Detector.webgl){
          startCircle();
        }else{
          $("#alert").fadeIn(300);
        }
      });
  };
	
	
	$("#sideway .btnStart img").on(onEnd,function(){
		$("#sideway").fadeOut(500,function(){
			startCircle();
		});
		SOUND.loadAllSound();
		SOUND.playHouseNameShow();
	});
};


function startCircle(){
  // debugger
	if(IMG_PRELOAD.fixFlag){
		//Circleアニメーション開始
		//CIRCLE_3D.firstStart();
		circle3d_firstStart();
		
		//! 模拟重新调用，重新生成 circle3d

		setTimeout(function(){
			$('#circle3d').empty()
			circle3d_firstStart()
		}, 12000)
    
	}else{
		$("#nowLoading").fadeIn(300);
	
		var timerID = setInterval(function(){
			if(IMG_PRELOAD.fixFlag){
				clearInterval(timerID);
				$("#nowLoading").fadeOut(300,function(){
					//Circleアニメーション開始
					//CIRCLE_3D.firstStart();
					circle3d_firstStart();
				});
			}
		},500);
	}
}

$('body').on('click', '.close-btn', function(){
  alert('1')
  $('.brand-info').hide()
})
