
//site navi

//var onStart,onEnd,onMove;

$(function(){
	 SITE_NAVI = new siteNavi();
});


var siteNavi = function(){
	this.viewNavFlag = false;
	this.soundFlag = true;
	this.gmap_iframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.5825577847345!2d139.7085529152582!3d35.66265518019868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b5fe9d167ab%3A0xdac3985329379fdb!2z44OQ44Kx44Op44OD44K_!5e0!3m2!1sja!2sjp!4v1520505175654" frameborder="0" style="border:0" allowfullscreen></iframe>';
	this.accessFirstFlag = true;
	var my = this;
	
	$("#siteNavi .profile").on(onEnd,function(){
		PROFILE.open();
		SOUND.playNav();
		/*if((deviceDtl == "iphone" || deviceDtl == "ipad") && $(window).width()>$(window).height()){
			$("html,body").scrollTop(-1);
			$("html,body").delay(300).scrollTop(50);
		}*/
	});
	
	$("#siteNavi .access").on(onEnd,function(){
		if(device=="sp"){
			window.location.href="http://maps.apple.com/?q=35.662655,139.710742&z=17";
		}else{
			set_iPhoneHeightLayout();
			$("#access").fadeIn(300);
			SOUND.playNav();
			/*if((deviceDtl == "iphone" || deviceDtl == "ipad") && $(window).width()>$(window).height()){
				$("html,body").scrollTop(-1);
				$("html,body").delay(300).scrollTop(50);
			}*/
			if(my.accessFirstFlag) $("#access .innerBlock .gmap").html(my.gmap_iframe);
			my.accessFirstFlag = false;
		}
	});
	
	$("#navSearch").on(onEnd,function(){
		HOUSE_SEARCH.openSearch();
		SOUND.playNav();
	});
	
	$("#siteNavi .sound").on(onEnd,function(){
		//alert($(window).scrollTop());
		//
		SOUND.playNav();
		if(my.soundFlag){
			my.soundFlag = false;
			$(this).find("img").attr("src","images/sitenav5_off.png");
			SOUND.soundOFF();
		}else{
			my.soundFlag = true;
			$(this).find("img").attr("src","images/sitenav5.png");
			SOUND.soundON();
		}
	});
	
	//access クローズ
	$("#access .return").on(onEnd, function(){
		$("#access").fadeOut(300);
		SOUND.playReturn();
	});
	
	//alert
	$("#alert .innerBlock .txt .link .prof").on(onEnd, function(){
		$("#profile").fadeIn(300);
	});
	$("#alert .innerBlock .txt .link .access").on(onEnd, function(){
		set_iPhoneHeightLayout();
		$("#access").fadeIn(300);
	});
	
	$(window).resize(function(){
		$("#navSearch .anima").height($("#navSearch").width()*(98/108));
	});
};

siteNavi.prototype.searchAnima = function(){
	var my = this;
	var img = new Image();
	img.src = "images/btn_search.png";
	var imgM = new Image();
	imgM.src = "images/btn_search_mr.png";
	var t = 150;
	
	var iconH = function(){
		//虫眼鏡アイコンの横幅は42〜65px window幅の6%
		var H = Math.max($(window).innerWidth()*0.06,42);
		H = Math.min(H,65)*(98/108);
		return H;
	}
	
	var animaIcon = function(){
		$("#navSearch .anima").css("height",iconH()+"px").animate({width:"1%",left:"49.5%",height:iconH()},t,"swing",function(){
			$(this).attr("src",imgM.src).css("height",iconH()+"px").animate({width:"100%",left:"0%",height:iconH()},t,"swing",function(){
				$(this).css("height",iconH()+"px").animate({width:"0%",left:"50%",height:iconH()},t,"swing",function(){
					$(this).attr("src",img.src).css("height",iconH()+"px").animate({width:"100%",left:"0%",height:iconH()},t,"swing",function(){
						if(my.viewNavFlag){
							$("#navSearch .anima").height(iconH());
							setTimeout(function (){
								$("#navSearch .anima").height(iconH());
								if(my.viewNavFlag) animaIcon();
							},3000);
						}else{
							$("#navSearch .anima").css("width","100%");
							$("#navSearch .anima").css("height",iconH()+"px");
						}
					})
				});
			});
		});
	}
	animaIcon();
};


siteNavi.prototype.showNavi = function(){
	//console.log("showNavi");
	var my = this;
	if(!my.viewNavFlag){
		//console.log(7777777777);
		if(viewDataType=="space" || viewDataType=="year"){
			$("#navSearch").css("right","14%");
		}else{
			$("#navSearch").css("right","4%");
		}
		
		//虫眼鏡アイコンの横幅は42〜65px window幅の6%
		var iconH = Math.max($(window).innerWidth()*0.06,42);
		iconH = Math.min(iconH,65)*(98/108);
		$("#navSearch .anima").height(iconH);
		//console.log(iconH);
		
		$("#siteNavi").fadeIn(200);
		$("#navSearch").delay(700).fadeIn(300);
		my.viewNavFlag = true;
		setTimeout(function(){
			my.searchAnima();
		},500);
	}
};


siteNavi.prototype.hideNavi = function(){
	if(this.viewNavFlag){
		$("#siteNavi,#navSearch").fadeOut(300,function(){
			//$("#navSearch").css("opacity","0");
		});
		this.viewNavFlag = false;
	}
};



