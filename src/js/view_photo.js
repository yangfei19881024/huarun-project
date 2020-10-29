//拡大画像表示


$(function(){
	 VIEW_PHOTO = new view_photo();
	
});


var view_photo = function(){
	this.type;		//house, space
	this.listData = {};		//物件またはspaceデータ
	this.firstFlag = true;	//拡大画像表示を初めて行ったかどうか
	this.mouseFlag = false;
	this.nowPhotoNum = 0;
	this.photoLeng = 0;
	this.photosLeft = 0;
	this.switchTypeFlag = false;		//space→houseの場合true
	
	var my = this;
	$(window).resize(function(){
		my.wResize();
	});
};


/*---------RESIZE---------*/
view_photo.prototype.wResize = function(){
	var ww = $(window).innerWidth();
	
	//ウィンドウの幅に写真に位置を合わせる
	//var leftPosition = $("#viewPhoto .photos").position().left;
	//var finishLeft = Math.round(leftPosition/ww)*ww;
	//$("#viewPhoto .photos").css("left",finishLeft+"px");
	
	this.resetPhotosPosition();
	this.setLayout();
};


/*---------photosとliの位置を初期化---------*/
view_photo.prototype.resetPhotosPosition = function(){
	var ww = $(window).innerWidth();
	$("#viewPhoto .photos").css("left","0px");
	$("#viewPhoto .photos li").eq(0).css("left",-ww+"px");
	$("#viewPhoto .photos li").eq(1).css("left","0px");
	$("#viewPhoto .photos li").eq(2).css("left",ww+"px");
};


/*---------ナビを初期化---------*/
view_photo.prototype.resetNav = function(){
	$("#viewPhoto .interface nav ul li").remove();
	$("#viewPhoto .interface nav ul li").off();
	/*var leng = $("#viewPhoto .interface nav ul li").length;
	for(var i=1; i<leng; i++){
		$("#viewPhoto .interface nav ul li").last().remove();
	}*/
};


/*---------ボタンを初期化---------*/
view_photo.prototype.resetBtns = function(){
	$("#viewPhoto .interface .return").off();
	$("#viewPhoto .interface .arrowR").off();
	$("#viewPhoto .interface .arrowL").off();
	$("#viewPhoto .interface h2").off();
	$("#viewPhoto .interface .subname").off();
	$("#viewPhoto").off();
};


/*---------変数を初期化---------*/
view_photo.prototype.resetProperty = function(){
	//this.type;		//house, space
	//this.listData = {};		//物件またはspaceデータ
	//this.firstFlag = true;	//拡大画像表示を初めて行ったかどうか
	this.mouseFlag = false;
	this.nowPhotoNum = 0;
	this.photoLeng = 0;
	this.photosLeft = 0;
	this.switchTypeFlag = false;		//space→houseの場合true
};



/*---------layout---------*/
view_photo.prototype.setLayout = function(){
	var ww = $(window).innerWidth();
	var wh = $(window).innerHeight();
	var imgL;
	var imgT;
	
	//画像本来のサイズを取得
	var getOriginalSize = function(path){
		var imgOrgn = new Image();
		imgOrgn.src = path;
		var orgnW = imgOrgn.width;
		var orgnH = imgOrgn.height;
		return [orgnW,orgnH];
	};
	
	for(var i=0; i<3; i++){
		var imgElem = $("#viewPhoto .photos li").eq(i).find(".pic");
		var imgOrgnSizeXY = getOriginalSize(imgElem.attr("src"));
		var imgW = imgOrgnSizeXY[0];
		var imgH = imgOrgnSizeXY[1];
		//console.log(imgOrgnSizeXY);
		var imgResizeW;
		var imgResizeH;
		/*if((ww >= wh && imgW >= imgH) || (ww < wh && imgW >= imgH)){
			imgResizeH = ww*(imgH/imgW);
			imgElem.width(ww).height(imgResizeH);
			imgT = (wh - imgResizeH)/2;
			imgElem.css({"top":imgT+"px", "left":"0px"});
			
		}else if((ww >= wh && imgW < imgH) || (ww < wh && imgW < imgH)){
			imgResizeW = wh*(imgW/imgH);
			imgElem.height(wh).width(imgResizeW);
			imgL = (ww - imgResizeW)/2;
			imgElem.css({"left":imgL+"px","top":"0px"});
		}*/
		
		if(ww/wh > imgW/imgH){
			imgResizeW = wh*(imgW/imgH);
			imgElem.height(wh).width(imgResizeW);
			imgL = (ww - imgResizeW)/2;
			imgElem.css({"left":imgL+"px","top":"0px"});
		}else{
			imgResizeH = ww*(imgH/imgW);
			imgElem.width(ww).height(imgResizeH);
			imgT = (wh - imgResizeH)/2;
			imgElem.css({"top":imgT+"px", "left":"0px"});
		}
		//$("#viewPhoto .photos li").eq(i).css("left",$(window).innerWidth()*(i-1)+"px");
	}
};



/*---------openView---------*/
view_photo.prototype.openView = function(type,num,list){
	//console.log("type : "+type);
	//console.log("num : "+num);
	//console.log(list);
	
	var my = this;
	this.type = type;
	if(type=="space"){
		this.listData = [];
	}else{
		this.listData = {};
		XML_DATA.changeCheckProperty(list.dre);
	}
	//console.log(searchHouseData);
	
	this.nowPhotoNum = num;
	this.listData = list;
	
	if(type=="space") this.setDataSpace_forHTML(type,num);
	if(type=="house") this.setDataHouse_forHTML(type,num);
	
	//liを配置
	for(var i=0; i<=3; i++){
		$("#viewPhoto .photos li").eq(i).css("left",$(window).innerWidth()*(i-1)+"px");
	}
	
	//画像先読み
	var pathList = [];
	if(type=="space") this.photoLeng = this.listData.length;
	if(type=="house") this.photoLeng = this.listData.photos.length;
	for(var i=0; i<this.photoLeng; i++){
		var imgPath;
		if(type=="space") imgPath = "images/"+this.listData[i].dre+"/"+this.listData[i].path;
		if(type=="house") imgPath = "images/"+this.listData.dre+"/"+this.listData.photos[i].path;
		pathList.push(imgPath);
	}
	setTimeout(function(){my.preloadIMG(pathList);},500);
	
	
	/*if(this.firstFlag) */this.setMouseEvent();
	
	this.firstFlag = false;
}



/*---------データをHTMLにセット type:houseデータ---------*/
view_photo.prototype.setDataHouse_forHTML = function(type,num){
	
	var prevNum;
	var nextNum;
	var leng = this.listData.photos.length;;
	var photoElem = this.listData.photos;
	var drec = "images/"+this.listData.dre+"/";		//写真のディレクトリ
	var v360prev;
	var v360now;
	var v360next;
	
	if(num==0){
		prevNum = leng - 1;
	}else{
		prevNum = num-1;
	}
	if(num==leng-1){
		nextNum = 0;
	}else{
		nextNum = num+1;
	}
	
	v360now = this.listData.photos[num].v360path;
	v360prev = this.listData.photos[prevNum].v360path;
	v360next = this.listData.photos[nextNum].v360path;
	
	this.imgPreloadAndShow($("#viewPhoto .photos li").eq(1).find(".pic"), drec+photoElem[num].path, v360now);
	this.imgPreloadAndShow($("#viewPhoto .photos li").eq(0).find(".pic"), drec+photoElem[prevNum].path, v360prev);
	this.imgPreloadAndShow($("#viewPhoto .photos li").eq(2).find(".pic"), drec+photoElem[nextNum].path, v360next);
	
	/*if(v360now==""){
		$("#viewPhoto .photos li").eq(1).find(".v360").hide();
	}else{
		$("#viewPhoto .photos li").eq(1).find(".v360").show();
	}
	if(v360prev==""){
		$("#viewPhoto .photos li").eq(0).find(".v360").hide();
	}else{
		$("#viewPhoto .photos li").eq(0).find(".v360").show();
	}
	if(v360next==""){
		$("#viewPhoto .photos li").eq(2).find(".v360").hide();
	}else{
		$("#viewPhoto .photos li").eq(2).find(".v360").show();
	}*/
	
	
	$("#viewPhoto .interface h2 span").text(this.listData.name);
	$("#viewPhoto .interface .subname").text(this.listData.subname);
	if(this.listData.new){
		$("#viewPhoto .interface h2 .NEW").show();
	}else{
		$("#viewPhoto .interface h2 .NEW").hide();
	}
	
	$("#viewPhoto .interface nav").show();
	/*for(var i=0; i<$("#viewPhoto .interface nav ul li").length; i++){
		$("#viewPhoto .interface nav ul li").eq(i).remove();
	}*/
	for(var i=0; i<leng; i++){
		$("#viewPhoto .interface nav ul").append('<li data-num="'+i+'"></li>');
	}
	$("#viewPhoto .interface nav ul li").eq(num).css("color","#fff");
	if(photoElem[num].copyright != ""){
		$("#viewPhoto .interface .copyright").html("&copy;"+photoElem[num].copyright);
	}else{
		$("#viewPhoto .interface .copyright").html("");
	}
	
	$("#viewPhoto").fadeIn(500);
	this.setLayout();
};


/*---------データをHTMLにセット type:spaceデータ---------*/
view_photo.prototype.setDataSpace_forHTML = function(type,num){
	var prevNum;
	var nextNum;
	var leng = this.listData.length;
	var photoElem = this.listData;
	var v360prev;
	var v360now;
	var v360next;

	if(num==0){
		prevNum = leng - 1;
	}else{
		prevNum = num-1;
	}
	if(num==leng-1){
		nextNum = 0;
	}else{
		nextNum = num+1;
	}
	
	var drec0 = "images/"+this.listData[prevNum].dre+"/";		//写真のディレクトリ
	var drec1 = "images/"+this.listData[num].dre+"/";		//写真のディレクトリ
	var drec2 = "images/"+this.listData[nextNum].dre+"/";		//写真のディレクトリ
	
	v360now = this.listData[num].v360path;
	v360prev = this.listData[prevNum].v360path;
	v360next = this.listData[nextNum].v360path;
	
	this.imgPreloadAndShow($("#viewPhoto .photos li").eq(1).find(".pic"), drec1+photoElem[num].path, v360now);
	this.imgPreloadAndShow($("#viewPhoto .photos li").eq(0).find(".pic"), drec0+photoElem[prevNum].path, v360prev);
	this.imgPreloadAndShow($("#viewPhoto .photos li").eq(2).find(".pic"), drec2+photoElem[nextNum].path, v360next);
	
	/*if(v360now==""){
		$("#viewPhoto .photos li").eq(1).find(".v360").hide();
	}else{
		$("#viewPhoto .photos li").eq(1).find(".v360").show();
	}
	if(v360prev==""){
		$("#viewPhoto .photos li").eq(0).find(".v360").hide();
	}else{
		$("#viewPhoto .photos li").eq(0).find(".v360").show();
	}
	if(v360next==""){
		$("#viewPhoto .photos li").eq(2).find(".v360").hide();
	}else{
		$("#viewPhoto .photos li").eq(2).find(".v360").show();
	}*/
	//console.log(photoElem[num].name);
	//console.log(photoElem[num].subname);
	$("#viewPhoto .interface h2 span").text(photoElem[num].name);
	$("#viewPhoto .interface .subname").text(photoElem[num].subname);
	if(photoElem[num].new){
		$("#viewPhoto .interface h2 .NEW").show();
	}else{
		$("#viewPhoto .interface h2 .NEW").hide();
	}
	/*
	for(var i=0; i<leng; i++){
		$("#viewPhoto .interface nav ul").append('<li data-num="'+i+'"></li>');
	}
	$("#viewPhoto .interface nav ul li").eq(num).css("color","#fff");
	*/
	$("#viewPhoto .interface nav").hide();
	if(photoElem[num].copyright != ""){
		$("#viewPhoto .interface .copyright").html("&copy;"+photoElem[num].copyright);
	}else{
		$("#viewPhoto .interface .copyright").html("");
	}
	
	$("#viewPhoto").fadeIn(500);
	this.setLayout();
};


/*---------画像先読み---------*/
view_photo.prototype.preloadIMG = function(imgPathList){
	IMG_PRELOAD.loadHouseSImg(imgPathList);
	var loopID;
	var loop = function(){
		if(IMG_PRELOAD.fixFlag){
			clearTimeout(loopID);
		}else{
			loopID = setTimeout(loop,300);
		}
	};
	loop();
};



/*---------マウスイベントの設定---------*/
view_photo.prototype.setMouseEvent = function(){
	var my = this;
	var swipMouseX01;
	var swipMouseX02;
	var swipMouseY01;
	var swipMouseY02;
	var swipDist;
	var swipDistY;
	var mouseMoveFlag = false;
	var leftPosition;
	var arrowBtnFlag = false;
	var arrowBtnFinishFlag = true;
	var navBtnFlag = false;
	var returnBtnFlag = false;
	var houseNameBtnFlag = false;
	var v360BtnFlag = false;
	
	//画面スワイプ
	$("#viewPhoto").on(onStart,function(ev){
		my.mouseFlag = true;
		swipDist = 0;
		if(device=="pc"){
			swipMouseX01 = ev.clientX;
			swipMouseY01 = ev.clientY;
		}else{
			swipMouseX01 = ev.touches[0].clientX;
			swipMouseY01 = ev.touches[0].clientY;
		}
		
		$(this).on(onMove, function(ev){
			ev.preventDefault();
			if(device=="pc"){
				swipMouseX02 = ev.clientX;
				swipMouseY02 = ev.clientY;
			}else{
				swipMouseX02 = ev.touches[0].clientX;
				swipMouseY02 = ev.touches[0].clientY;
			}
			swipDist = swipMouseX02 - swipMouseX01;
			swipDistY = swipMouseY02 - swipMouseY01;
			swipMouseX01 = swipMouseX02;
			swipMouseY01 = swipMouseY02;
			if(Math.abs(swipDist)>0) mouseMoveFlag = true;
			leftPosition = $(this).find(".photos").position().left;
			
			var liW = $(this).find(".photos li").eq(1).width();
			var liH = $(this).find(".photos li").eq(1).height();
			var targetIMG = $(this).find(".photos li").eq(1).find(".pic");
			var imgL = targetIMG.position().left;
			var imgT = targetIMG.position().top;
			var imgW = targetIMG.width();
			var imgH = targetIMG.height();
			var imgLeftPosition = targetIMG.position().left;
			var imgTopPosition = targetIMG.position().top;
			
			if(swipDist>0 && imgL<0 && Math.abs(swipDist/swipDistY)>2){
				targetIMG.css("left",imgLeftPosition+swipDist+"px");
				if(imgL>0) targetIMG.css("left","0px");
			}else if(swipDist<0 && imgL>liW-imgW && Math.abs(swipDist/swipDistY)>2){
				targetIMG.css("left",imgLeftPosition+swipDist+"px");
				if(imgL<liW-imgW) targetIMG.css("left",liW-imgW+"px");
			}else if(Math.abs(swipDist/swipDistY)>2){
				//全体をスワイプ
				$(this).find(".photos").css("left",leftPosition+swipDist+"px");
				my.infiniteLoop($(this).find(".photos"),swipDist);
			}
			if(swipDistY>0 && imgT<0){
				targetIMG.css("top",imgTopPosition+swipDistY+"px");
				if(imgT>0) targetIMG.css("top","0px");
			}else if(swipDistY<0 && imgT>liH-imgH){
				targetIMG.css("top",imgTopPosition+swipDistY+"px");
				if(imgT<liH-imgH) targetIMG.css("top",liH-imgH+"px");
			}
			
		});
		$(this).on(onEnd, function(ev){
			my.mouseFlag = false;
			my.photosLeft = leftPosition;
			if(!arrowBtnFlag) my.animateMouseFinish($(this).find(".photos"),swipDist);
			swipMouseY01 = 0;
			swipMouseY02 = 0;
			$(this).off(onMove);
			$(this).off(onEnd);
			
			//interfaceのON.OFF
			if(!mouseMoveFlag && !arrowBtnFlag && !navBtnFlag && !returnBtnFlag && !houseNameBtnFlag && !v360BtnFlag){
				if($("#viewPhoto .interface").css("display")=="none") {
					$("#viewPhoto .interface").fadeIn(300);
				}else{
					$("#viewPhoto .interface").fadeOut(300);
				}
			}
			
			mouseMoveFlag = false;
		});
	});
	
	//左右矢印ボタン
	$("#viewPhoto .interface .arrowL,#viewPhoto .interface .arrowR").on(onStart,function(){
		arrowBtnFlag = true;
	});
	$("#viewPhoto .interface .arrowL").on(onEnd, function(){
		
		//if(arrowBtnFinishFlag){
		arrowBtnFinishFlag = false;
		SOUND.playViewPhotoBtn();
		swipDist = 0.1;
		var ww = $(window).innerWidth();
		leftPosition = $("#viewPhoto .photos").position().left;
		var finishLeft = Math.round(leftPosition/ww)*ww+ww;
		var t = Math.abs(finishLeft - leftPosition)*0.4;
		$("#viewPhoto .photos").stop().animate({left:finishLeft+"px"},t,"swing",function(){
			arrowBtnFlag = false;
			arrowBtnFinishFlag = true;
			my.infiniteLoop($(this),swipDist);
		});
		//}
	});
	$("#viewPhoto .interface .arrowR").on(onEnd, function(){
		
		//if(arrowBtnFinishFlag){
		arrowBtnFinishFlag = false;
		SOUND.playViewPhotoBtn();
		swipDist = -0.1;
		var ww = $(window).innerWidth();
		leftPosition = $("#viewPhoto .photos").position().left;
		var finishLeft = Math.round(leftPosition/ww)*ww-ww;
		var t = Math.abs(finishLeft - leftPosition)*0.4;
		$("#viewPhoto .photos").stop().animate({left:finishLeft+"px"},t,"swing",function(){
			arrowBtnFlag = false;
			arrowBtnFinishFlag = true;
			my.infiniteLoop($(this),swipDist);
		});
		//}
	});
	
	//戻るボタン
	$("#viewPhoto .interface .return").on(onStart,function(){
		returnBtnFlag = true;
	});
	$("#viewPhoto .interface .return").on(onEnd,function(){
		SOUND.playReturn();
		if(my.type=="house" && !my.switchTypeFlag){
			SORT_VERTICAL.clearThum_forViewPhoto();
		}else if(my.type=="house" && my.switchTypeFlag){
			$("#searchFix").hide();
		}
		$("#viewPhoto").fadeOut(500,function(){
			if(my.type=="house" && my.switchTypeFlag){
				//{data: "070_jj_house", type: "dre", viewtxt: "JJ HOUSE"}
				var dataObj = {
					data : my.listData.dre,
					type : "dre",
					viewtxt : ""
				};
				c3dAfterSearch(dataObj);
			}
			if(my.type=="house" && !my.switchTypeFlag) c3dSetCheckMark(my.listData.dre);
			if(my.type=="space"){
				c3dMouseActLockFlag = false;
				SORT_VERTICAL.openFlag = false;
			}
			my.resetPhotosPosition();
			my.resetNav();
			my.resetBtns();
			my.resetProperty();
			$("#viewPhoto .interface").show();
			$("#viewPhoto .photos li .pic").css("opacity","0");
			returnBtnFlag = false;
			SITE_NAVI.showNavi();
		});
		
	});
	
	
	//ナビ - ●●●●●●
	$("#viewPhoto .interface nav ul li").on(onStart,function(){
		navBtnFlag = true;
	});
	$("#viewPhoto .interface nav ul li").on(onEnd,function(){
		SOUND.playViewPhotoBtn();
		var ww = $(window).innerWidth();
		var finishNum = $("#viewPhoto .interface nav ul li").index(this);
		var leftPosition;
		var startLeft = $("#viewPhoto .photos").position().left;
		var finishLeft = -(finishNum - my.nowPhotoNum)*ww + startLeft;
		var cnt = 0;
		var t = (Math.abs(finishLeft-startLeft))/5000;
		var loopID;
		clearTimeout(loopID);
		
		var loop = function(){
			leftPosition = Math.easeInOutCubic(cnt, startLeft, finishLeft-startLeft, 1);
			cnt += 1/(60*t);
			$("#viewPhoto .photos").css("left",leftPosition+"px");
			my.infiniteLoop($("#viewPhoto .photos"),(finishLeft-startLeft)/100);
			if(cnt<1){
				loopID = setTimeout(loop,1000/60);
			}else{
				navBtnFlag = false;
				clearTimeout(loopID);
			}
		};
		loop();
	});
	
	
	//物件名をクリック
	$("#viewPhoto .interface h2, #viewPhoto .interface .subname").on(onStart,function(){
		houseNameBtnFlag = true;
	});
	$("#viewPhoto .interface h2, #viewPhoto .interface .subname").on(onEnd,function(){
		SOUND.playViewPhotoBtn();
		$("#viewPhoto .photos, #viewPhoto .interface").fadeOut(300,function(){
			houseNameBtnFlag = false;
			var dreName;
			my.resetNav();
			my.resetBtns();
			if(my.type=="house"){
				my.openView("house", 0, my.listData);
			}else if(my.type=="space"){
				dreName = my.listData[my.nowPhotoNum].dre;
				my.listData = {};
				my.listData = XML_DATA.getHouseData(dreName);
				my.openView("house", 0, my.listData);
				my.switchTypeFlag = true;
			}
			my.resetPhotosPosition();
			$("#viewPhoto .photos, #viewPhoto .interface").fadeIn(300);
		});
	});
	
	
	//360view OPEN
	$("#viewPhoto .photos li .v360").on(onStart,function(){
		v360BtnFlag = true;
	});
	$("#viewPhoto .photos li .v360").on(onEnd,function(){
		var drec;
		var v360Path;
		var srcPath;
		
		SOUND.playViewPhotoBtn();
		if(my.type=="house"){
			drec = my.listData.dre;
			v360Path = my.listData.photos[my.nowPhotoNum].v360path;
		}else if(my.type=="space"){
			drec = my.listData[my.nowPhotoNum].dre;
			v360Path = my.listData[my.nowPhotoNum].v360path;
		}
		srcPath = "view360/index.html?image=../images/"+drec+"/"+v360Path+"&is_stereo=true";
		$("#view360 iframe").attr("src",srcPath);
		$("#view360").fadeIn(500,function(){
			v360BtnFlag = false;
		});
	});
	
	//360view CLOSE
	$("#view360 .return").on(onEnd,function(){
		SOUND.playReturn();
		$("#view360").fadeOut(500);
	});
};


//スワイプの余韻
view_photo.prototype.animateMouseFinish = function(elem,swipDist){
	var my = this;
	var ww = $(window).innerWidth();
	var nowLI = elem.find("li").eq(1);
	var nowLiLeft = nowLI.offset().left;
	
	var timerID = setTimeout(function(){
		if(Math.abs(nowLiLeft)<ww/2 && Math.abs(swipDist)>14){
			swipDist *= 0.98;
			var leftPosition = elem.position().left;
			elem.css("left",leftPosition+swipDist+"px");
			my.infiniteLoop(elem,swipDist);
			my.animateMouseFinish(elem,swipDist);
		}else{
			my.fitFinishLI(elem,swipDist);
			clearTimeout(timerID);
		}
	},16);
};


//項目の位置でキュッと止まる
view_photo.prototype.fitFinishLI = function(elem,swipDist){
	var my = this;
	var ww = $(window).innerWidth();
	var nowLI = elem.find("li").eq(1);
	var nowLiLeft = nowLI.offset().left;
	var leftPosition = elem.position().left;
	var finishLeft;
	
	if(nowLiLeft < 0-ww/3 && nowLiLeft < 0-ww/2){
		finishLeft = Math.round(leftPosition/ww)*ww;
	}else if(nowLiLeft < 0-ww/3 && nowLiLeft >= 0-ww/2){
		finishLeft = Math.round((leftPosition-ww)/ww)*ww;
	}else if(nowLiLeft > ww/3 && nowLiLeft > ww/2){
		finishLeft = Math.round(leftPosition/ww)*ww;
	}else if(nowLiLeft > ww/3 && nowLiLeft <= ww/2){
		finishLeft = Math.round((leftPosition+ww)/ww)*ww;
	}else{
		finishLeft = Math.round(leftPosition/ww)*ww;
	}
	
	//var finishLeft = Math.round(leftPosition/ww)*ww;
	var t = Math.abs(finishLeft - leftPosition)*0.9 - Math.abs(swipDist)*4;
	elem.stop().animate({left:finishLeft+"px"},t,"swing",function(){
		my.infiniteLoop(elem,swipDist);
	});
};


/*---------無限ループ---------*/
view_photo.prototype.infiniteLoop = function(elem,swipDist){
	var my = this;
	var leng = elem.find("li").length;
	var lis = elem.find("li");
	var leftPosition = elem.position().left;
	var ww = $(window).innerWidth();
	var movedLeft;
	var next_prev;		//next,prev
	var imgPath;
	var prevNum;
	var nextNum;
	var moveElem;
	var v360;
	
	//prev
	if(lis.first().offset().left > -ww/3 && swipDist>=0){
		if(this.nowPhotoNum == 0){
			this.nowPhotoNum = this.photoLeng-1;
		}else{
			this.nowPhotoNum--;
		}
		
		movedLeft = lis.first().position().left - ww;
		moveElem = lis.last();
		moveElem.insertBefore(lis.first());
		moveElem.css("left",movedLeft+"px");
		
		//prev画像パスを設定
		if(this.nowPhotoNum==0){
			prevNum = this.photoLeng-1;
		}else{
			prevNum = this.nowPhotoNum-1;
		}
		if(this.type=="house"){
			imgPath = "images/"+this.listData.dre+"/"+this.listData.photos[prevNum].path;
			v360 = this.listData.photos[prevNum].v360path;
		}else if(this.type=="space"){
			imgPath = "images/"+this.listData[prevNum].dre+"/"+this.listData[prevNum].path;
			v360 = this.listData[prevNum].v360path;
		}
		//moveElem.find(".pic").attr("src",imgPath);
		this.imgPreloadAndShow(moveElem.find(".pic"), imgPath, v360);
		/*if(v360==""){
			moveElem.find(".v360").hide();
		}else{
			moveElem.find(".v360").show();
		}*/
		
		next_prev = "prev";
		//this.setLayout();
		this.changeView();
	}
	
	//next
	if(lis.last().offset().left < ww/3 && swipDist<=0){
		if(this.nowPhotoNum == this.photoLeng-1){
			this.nowPhotoNum=0;
		}else{
			this.nowPhotoNum++;
		}
		
		movedLeft = lis.last().position().left + ww;
		moveElem = lis.first();
		moveElem.insertAfter(lis.last());
		moveElem.css("left",movedLeft+"px");
		
		//next画像パスを設定
		if(this.nowPhotoNum==this.photoLeng-1){
			nextNum = 0;
		}else{
			nextNum = this.nowPhotoNum+1;
		}
		if(this.type=="house"){
			imgPath = "images/"+this.listData.dre+"/"+this.listData.photos[nextNum].path;
			v360 = this.listData.photos[nextNum].v360path;
		}else if(this.type=="space"){
			imgPath = "images/"+this.listData[nextNum].dre+"/"+this.listData[nextNum].path;
			v360 = this.listData[nextNum].v360path;
		}
		//moveElem.find(".pic").attr("src",imgPath);
		this.imgPreloadAndShow(moveElem.find(".pic"), imgPath, v360);
		/*if(v360==""){
			moveElem.find(".v360").hide();
		}else{
			moveElem.find(".v360").show();
		}*/
		
		next_prev = "next";
		this.photosLeft = elem.position().left;
		//this.setLayout();
		this.changeView();
	}
};


/*---------画像先読み＆フェードイン---------*/
view_photo.prototype.imgPreloadAndShow = function(elem,path,v360){
	var my = this;
	elem.css("opacity","0");
	var img = new Image();
	img.src = path;
	var cnt = 0;
	
	var fixFlag = false;
	img.onload = function(){
		fixFlag = true;
	}
	
	var loopID;
	var loop = function(){
		if(fixFlag && cnt==0){
			elem.attr("src",img.src);
			elem.css("opacity","1");
			if(v360==""){
				elem.parent().find(".v360").hide();
			}else{
				elem.parent().find(".v360").show();
			}
			my.setLayout();
			clearTimeout(loopID);
		}else if(fixFlag && cnt>0){
			elem.attr("src",img.src);
			elem.animate({opacity:1},300,"linear");
			if(v360==""){
				elem.parent().find(".v360").hide();
			}else{
				elem.parent().find(".v360").fadeIn(300);
			}
			my.setLayout();
			clearTimeout(loopID);
		}else{
			loopID = setTimeout(loop,100);
		}
		cnt++;
	};
	loop();
	/*
	img.onload = function(){
		elem.attr("src",img.src);
		elem.animate({opacity:1},300,"linear");
		my.setLayout();
	};
	*/
};


/*---------表示内容変更---------*/
view_photo.prototype.changeView = function(){
	var h2;
	var subname;
	var newFlag;
	var copyright;
	var imgPath;
	var navLeng = $("#viewPhoto .interface nav ul li").length;
	
	if(this.type=="house"){
		h2 = this.listData.name;
		subname = this.listData.subname;
		newFlag = this.listData.new;
		copyright = this.listData.photos[this.nowPhotoNum].copyright;
		imgPath = "images/"+this.listData.dre+"/"+this.listData.photos[this.nowPhotoNum].path;
	}else if(this.type=="space"){
		h2 = this.listData[this.nowPhotoNum].name;
		subname = this.listData[this.nowPhotoNum].subname;
		newFlag = this.listData[this.nowPhotoNum].new;
		copyright = this.listData[this.nowPhotoNum].copyright;
		imgPath = "images/"+this.listData[this.nowPhotoNum].dre+"/"+this.listData[this.nowPhotoNum].path;
	}
	
	$("#viewPhoto .interface h2 span").text(h2);
	$("#viewPhoto .interface .subname").text(subname);
	if(newFlag) $("#viewPhoto .interface h2 img").show();
	if(!newFlag) $("#viewPhoto .interface h2 img").hide();
	if(copyright != ""){
		$("#viewPhoto .interface .copyright").html("&copy;"+copyright);
	}else{
		$("#viewPhoto .interface .copyright").html("");
	}
	
	
	for(var i=0; i<navLeng; i++){
		var liElem = $("#viewPhoto .interface nav ul li").eq(i);
		if(this.nowPhotoNum == liElem.data("num")){
			liElem.css("color","#fff");
		}else{
			liElem.css("color","#666");
		}
	}
};




/*
	this.type;		//house, space
	this.listData = {};		//物件またはspaceデータ
	this.firstFlag = true;	//拡大画像表示を初めて行ったかどうか
	this.mouseFlag = false;
	this.nowPhotoNum = 0;
	this.photoLeng

*/


		


	

