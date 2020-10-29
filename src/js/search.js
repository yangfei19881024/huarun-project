//物件絞り込み


$(function(){
	 HOUSE_SEARCH = new house_search();
	
});


var house_search = function(){
	this.flag = 0;		//filter search:0, name search:1
	this.openFlag = false;
	this.firstFlag = true;
	this.spaceNameList = [
		{name:"Living room", val:"living"},
		{name:"Dining room", val:"diningroom"},
		{name:"Kitchen", val:"kitchen"},
		{name:"Terrace", val:"terrace"},
		{name:"Corridor", val:"corridor"},
		{name:"Entrance", val:"entrance"},
		{name:"Garden", val:"garden"},
		{name:"Appearance", val:"appearance"},
		{name:"Bedroom", val:"bedroom"},
		{name:"Bath room", val:"bathroom"},
		{name:"Rest room", val:"restroom"},
		{name:"Hobby room", val:"hobbyroom"},
		{name:"Library", val:"library"},
		{name:"Japanese-style room", val:"japanesestyleroom"},
		{name:"Kids room", val:"kidsroom"},
		{name:"Closet", val:"closet"},
		{name:"Stairs", val:"stairs"},
		{name:"Office", val:"office"},
		{name:"Shop", val:"shop"}
	];
	
	this.yearList = [
		{name:"1995-2010", min:1995, max:2010},
		{name:"2011-2015", min:2011, max:2015},
		{name:"2016-", min:2016, max:2020}
	];
	
	this.houseNameList = [];		//物件の名前とディレクトリのリスト
	this.liH = 0;	//liの高さ
	this.swipMouseY01 = 0;		//マウスダウン時のY座標
	this.swipMouseY02 = 0;		//マウスムーブ時のY座標
	this.swipDist = 0;				//マウスの移動距離
	this.mouseFlag = false;
	this.hitData = {};				//選択された検索項目
	
	var my = this;
	$("#search .return").on(onEnd,function(){
		SOUND.playReturn();
		my.closeSearch();
		setTimeout(function(){SITE_NAVI.showNavi();},500);
	});
	$("#search .innerBox .btnSwitch").on(onEnd, function(){
		SOUND.playSearchBtn();
		my.switchView();
	});
	
	my.setSearchBtn();
	
	$(window).resize(function(){
		if(my.openFlag){
			$("#search .innerBox").eq(0).css("margin-top",-$(window).innerHeight()*my.flag+"px");
			my.setGradation();
			//my.fitFinishLI($("#search .innerBox .listBox ul"));
			my.fitFinishLI($("#search .innerBox").eq(0).find(".listBox ul"));
			my.fitFinishLI($("#search .innerBox").eq(1).find(".listBox ul"));
		}
	});
};


/*---------Reset---------*/
house_search.prototype.resetSearch = function(){
	$("#search .innerBox").css("opacity","1").show();
	$("#search").hide();
	//this.flag = 0;
	this.mouseFlag = false;
	this.openFlag = false;
};


/*---------first Open---------*/
house_search.prototype.firstOpen = function(){
	//this.houseNameList [6].name /  this.houseNameList [6].dre
	this.houseNameList = XML_DATA.getSortNameAndDre_Alphabet();
	this.setLI();
	this.mouseEvent();
	//this.fitFinishLI($("#search .innerBox").eq(0).find(".listBox ul"));
	this.fitFinishLI($("#search .innerBox").eq(1).find(".listBox ul"));
	//console.log(this.houseNameList);
};


/*---------li を配置---------*/
house_search.prototype.setLI = function(){
	for(var i=0; i<this.yearList.length; i++){
		$("#search .innerBox").eq(0).find(".listBox ul").append('<li data-type="year" data-name="'+this.yearList[i].min+'-'+this.yearList[i].max+'" data-min="'+this.yearList[i].min+'" data-max="'+this.yearList[i].max+'">'+this.yearList[i].name+'</li>');
	}
	for(var i=0; i<this.spaceNameList.length; i++){
		$("#search .innerBox").eq(0).find(".listBox ul").append('<li class="sn'+i+'" data-type="space" data-name="'+this.spaceNameList[i].val+'">'+this.spaceNameList[i].name+'</li>');
	}
	for(var i=0; i<this.houseNameList.length; i++){
		var newTag = "";
		if(this.houseNameList[i].new) newTag = '<img class="new" src="images/circle_icon_new.png" alt="NEW" />';
		$("#search .innerBox").eq(1).find(".listBox ul").append('<li class="sn'+i+'" data-type="dre" data-name="'+this.houseNameList[i].dre+'">'+this.houseNameList[i].name+newTag+'</li>');
	}
};


/*---------グラデーション配置---------*/
house_search.prototype.setGradation = function(){
	var listBoxH = $(window).innerHeight();
	/*var listBoxH;
	if((deviceDtl == "iphone" || deviceDtl == "ipad") && $(window).width()>$(window).height()){
		listBoxH = $(window).innerHeight()-70*0.7;
	}else if((deviceDtl == "iphone" || deviceDtl == "ipad") && $(window).width()<$(window).height()){
		listBoxH = $(window).innerHeight();
	}else{
		listBoxH = $(window).innerHeight();
	}*/
	this.liH = $("#search .innerBox .listBox ul li").height() + parseInt($("#search .innerBox .listBox ul li").css("padding-top"))*2;
	$("#search .innerBox .listBox").height(listBoxH);
	$("#search .innerBox .listBox .grdT, #search .innerBox .listBox .grdB").height((listBoxH - this.liH)/2);
	
	$("#search .return").hide();
};



/*---------Search Open----------*/
house_search.prototype.openSearch = function(){
	this.openFlag = true;
	if(this.flag==0){
		$("#search .innerBox").eq(0).css("margin-top", stageH+"px");
	}else{
		$("#search .innerBox").eq(0).css({"opacity":"0","margin-top":"0px"});
	}
	
	SITE_NAVI.hideNavi();
	$("#search").show();
	
	if(this.firstFlag){
		this.firstOpen();
	}
	this.setGradation();
	
	$("#search .return").delay(1000).fadeIn(300);
	
	if(this.flag==0){
		$("#search .innerBox").eq(0).animate({marginTop:"0px"},500,"swing");
	}else{
		$("#search .innerBox").eq(0).animate({marginTop:-stageH+"px"},500,"swing",function(){
			$(this).css("opacity","1");
		});
	}
	
	if(this.firstFlag){
		//$("#search .innerBox").eq(0).find(".listBox ul").css("margin-top","300px");
		$("#search .innerBox").eq(1).find(".listBox ul").css("margin-top", $("#search .innerBox .listBox .grdT").innerHeight()+"px");
		$("#search .innerBox").eq(0).find(".listBox ul").css("margin-top", $("#search .innerBox .listBox .grdT").innerHeight() - $("#search .innerBox").eq(0).find(".listBox ul .sn0").position().top+"px");
		//this.infiniteLoop($("#search .innerBox").eq(0).find(".listBox ul"));
		
		var leng = Math.ceil($("#search .innerBox .listBox .grdT").innerHeight()/this.liH);
		for(var i=0; i<=leng; i++){
			this.infiniteLoop($("#search .innerBox").eq(1).find(".listBox ul"));
		}
		//this.moveOpening();
	}
	
	this.firstFlag = false;
};


/*---------Search Close----------*/
house_search.prototype.closeSearch = function(){
	var my = this;
	if(this.flag==0){
		$("#search .innerBox").eq(0).animate({marginTop:stageH+"px"},500,"swing",function(){
			my.resetSearch();
		});
	}else{
		$("#search .innerBox").eq(0).css("opacity","0");
		$("#search .innerBox").eq(0).animate({marginTop:"0px"},500,"swing",function(){
			my.resetSearch();
		});
	}
	$("#search .return").fadeOut(100);
	
};


/*---------Opening Move---------*/
/*house_search.prototype.moveOpening = function(){
	var my = this;
	var elem = $("#search .innerBox").eq(0).find(".listBox ul");
	var grdTH = $("#search .innerBox .listBox .grdT").height();
	var sn0Y = elem.find(".sn0").position().top;
	console.log("grdTH : "+grdTH);
	console.log("sn0Y : "+sn0Y);
	elem.css("margin-top",grdTH-sn0Y+"px");
	my.infiniteLoop(elem);
	my.fitFinishLI(elem);
	
	function loop(elem){
		var timerID = setTimeout(function(){
			var topPosition = parseInt(elem.css("margin-top"));
			var sn0Y = elem.find(".sn0").offset().top;
			if(Math.abs(grdTH-sn0Y) > 15){
				topPosition -= 4;
				my.swipDist = topPosition - parseInt(elem.css("margin-top"));
				elem.css("margin-top", topPosition+"px");
				my.infiniteLoop(elem);
				loop(elem);
			}else{
				my.animateMouseFinish(elem);
				clearTimeout(timerID);
			}
		},1000/60);
	}
	loop($("#search .innerBox").eq(0).find(".listBox ul"));
};*/


/*---------FilterとNameをスイッチ---------*/
house_search.prototype.switchView = function(){
	var mgT = 0;
	if(this.flag==0){
		this.flag = 1;
	}else{
		this.flag = 0;
	}
	$("#search .innerBox").eq(0).animate({marginTop:-$("#search").height()*this.flag+"px"},500,"swing");
	//$("#search .innerBox").eq(0).animate({marginTop:-stageH*this.flag+"px"},500,"swing");
};


/*---------マウス操作---------*/
house_search.prototype.mouseEvent = function(){
	var my = this;
	$("#search .innerBox .listBox").on(onStart, function(ev){
		my.mouseFlag = true;
		if(device=="pc"){
			my.swipMouseY01 = ev.clientY;
		}else{
			my.swipMouseY01 = ev.touches[0].clientY;
		}
		$(this).on(onMove, function(ev){
			//if(my.mouseFlag){
				ev.preventDefault();
				if(device=="pc"){
					my.swipMouseY02 = ev.clientY;
				}else{
					my.swipMouseY02 = ev.touches[0].clientY;
				}
				my.swipDist = my.swipMouseY02 - my.swipMouseY01;
				my.swipMouseY01 = my.swipMouseY02;
				var topPosition = parseInt($(this).find("ul").css("margin-top"));
				$(this).find("ul").css("margin-top",topPosition+my.swipDist+"px");
				my.infiniteLoop($(this).find("ul"));
				$(this).css({"cursor":'url(images/icon_hand_tate.cur),url(images/icon_hand_tate.png),move'});
			//}
		});
		$(this).on(onEnd, function(ev){
			my.mouseFlag = false;
			my.animateMouseFinish($(this).find("ul"));
			my.swipMouseY01 = 0;
			my.swipMouseY02 = 0;
			$(this).off(onMove);
			$(this).off(onEnd);
		});
	});
	
	var wheelLoopID;
	var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	$("#search .innerBox .listBox").on(mousewheelevent,function(ev){
		//e.preventDefault();
		my.swipDist = ev.originalEvent.deltaY ? -(ev.originalEvent.deltaY) : ev.originalEvent.wheelDelta ? ev.originalEvent.wheelDelta : -(ev.originalEvent.detail);
		my.swipDist *= 10;
		if(my.swipDist>0){
			my.swipDist = Math.max(my.swipDist,5);
			my.swipDist = Math.min(my.swipDist,60);
		}else if(my.swipDist<0){
			my.swipDist = Math.min(my.swipDist,-5);
			my.swipDist = Math.max(my.swipDist,-60);
		}
		var topPosition = parseInt($(this).find("ul").css("margin-top"));
		$(this).find("ul").css("margin-top",topPosition+my.swipDist+"px");
		my.infiniteLoop($(this).find("ul"));
		
		var ulElem = $(this).find("ul");
		clearTimeout(wheelLoopID);
		wheelLoopID = setTimeout(function(){
			//my.swipDist *= 0.05;
			my.fitFinishLI(ulElem);
		},300);
		
	});
};

//スワイプの余韻
house_search.prototype.animateMouseFinish = function(elem){
	var my = this;
	var timerID = setTimeout(function(){
		//my.infiniteLoop();
		
		if(Math.abs(my.swipDist)>2){
			my.swipDist *= 0.9;
			var topPosition = parseInt(elem.css("margin-top"));
			elem.css("margin-top",topPosition+my.swipDist+"px");
			my.infiniteLoop(elem);
			my.animateMouseFinish(elem);
		}else{
			my.fitFinishLI(elem);
			clearTimeout(timerID);
		}
	},1000/60);
};

//項目の位置でキュッと止まる
house_search.prototype.fitFinishLI = function(elem){
	var my = this;
	var activeY = $("#search .innerBox .listBox .grdT").height();
	var topPosition = parseInt(elem.css("margin-top"));
	var dist = (topPosition - activeY) % my.liH;
	//var dist = (elem.find("li").eq(0).offset().top - activeY) % my.liH;
	var finishY;
	if(Math.abs(dist) < my.liH/2){
		finishY = topPosition + Math.abs(dist);
	}else{
		finishY = topPosition - (my.liH - Math.abs(dist));
	}
	/*if(activeY % my.liH < my.liH/2){
		finishY = Math.round(topPosition/my.liH)*my.liH + (activeY % my.liH);
	}else{
		finishY = Math.round(topPosition/my.liH)*my.liH - (my.liH - activeY % my.liH);
	}*/
	//finishY = Math.round(topPosition/my.liH)*my.liH
	var t = Math.abs(finishY - topPosition)*20;
	elem.stop().animate({marginTop:finishY+"px"},t,"swing",function(){
		my.swipDist = 0;
	});
};



/*---------無限ループ---------*/
house_search.prototype.infiniteLoop = function(elem){
	var my = this;
	var leng = elem.find("li").length;
	var lis = elem.find("li");
	var topPosition = parseInt(elem.css("margin-top"));
	
	if(lis.first().offset().top > -my.liH && my.swipDist>=0){
		lis.last().insertBefore(lis.first());
		elem.css("margin-top", topPosition - my.liH+"px");
	}
	if(lis.last().offset().top < $(window).innerHeight() && my.swipDist<0){
		lis.first().insertAfter(lis.last());
		elem.css("margin-top", topPosition + my.liH+"px");
	}
};



/*---------選択された項目を取得---------*/
house_search.prototype.getSelectData = function(elem){
	var my = this;
	var leng = elem.find("li").length;
	var grdTH = $("#search .innerBox .listBox .grdT").innerHeight();
	var liY = 9999;
	var dataObj = {data:"", type:""};
	
	for(var i=0; i<leng; i++){
		var hikakuY = liY;
		liY = Math.min(liY, Math.abs(grdTH - elem.find("li").eq(i).offset().top));
		if(hikakuY != liY){
			dataObj.data = elem.find("li").eq(i).data("name");
			dataObj.type = elem.find("li").eq(i).data("type");
			dataObj.viewtxt = elem.find("li").eq(i).text();
		}
	}
	return dataObj;
};



/*---------Searchボタン設定---------*/
house_search.prototype.setSearchBtn = function(){
	var my = this;
	//$("#search .innerBox .btnSearch, #search .innerBox .listBox ul").on(onEnd, function(){
	$("#search .innerBox .listBox ul").on(onEnd, function(){
		//console.log(my.swipDist);
		if(my.swipDist==0){
			SOUND.playSearchBtn();
			$("#searchFix").hide();
			my.hitData = my.getSelectData($("#search .innerBox").eq(my.flag).find(".listBox ul"));
			//console.log(my.hitData);
			my.closeSearch();
			setTimeout(c3dAfterSearch(my.hitData),600);		//circle3d.jsへ
		}
	});
};



		


	

