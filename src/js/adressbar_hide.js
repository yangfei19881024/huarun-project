
$(function(){
	if(deviceDtl=="iphone"){
		ADRESS_BAR_HIDE = new adressbarHide();
	}
});

var adressbarHide = function(){
	this.firstFlag = true;
	this.perc = 180/1920;
	this.bar = $("#adressBarHide .inner .bar");
	
	var my = this;
	var bar = $("#adressBarHide .inner .bar");
	var timerID;

	var showBottomBar = function(){
		//alert(111)
		if(my.firstFlag){
			//alert(222);
			clearTimeout(timerID);
			timerID = setTimeout(function(){
				var scTop = $(window).scrollTop();
				if(scTop>0){
					var barH = $(window).width()*my.perc;
					$("#adressBarHide").height(barH);
					$("#adressBarHide .inner").css("top",barH+"px");
					$("#adressBarHide").show();
					$("#adressBarHide .inner").animate({top:"0px"},300,"swing",function(){
						my.firstFlag = false;
						$(this).delay(5000).animate({top:barH+"px"},300,"swing");
					});
				}
			},500);
		}else if($("#adressBarHide").css("display")=="block"){
			$("#adressBarHide").hide();
		}
	};
	
	
	if($(window).scrollTop()!=0 && $(window).width()>$(window).height()){
		my.firstFlag = false;
	}
	
	$(window).resize(function(){
		showBottomBar();
	});
	//showBottomBar();
	
	$("#adressBarHide .inner .close").on(onEnd,function(){
		var barH = $(window).width()*my.perc;
		$("#adressBarHide .inner").stop().animate({top:barH+"px"},300,"swing",function(){
			$("#adressBarHide").hide();
		});
	});
};

//windowリサイズ
