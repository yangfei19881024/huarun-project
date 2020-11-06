//サムネイル縦並び


$(function(){
	SORT_VERTICAL = new sort_vertical();
 
});


var sort_vertical = function(){
 this.resetProperty();
 this.setSwip();
 this.setReturnBtn();
 this.firstFlag = true;
 
 var my = this;
 $(window).resize(function(){
	 if(my.openFlag){
		 var pnt = getScreenPoint(choiceBoxObj);
		 my.picSize = pnt.size*1.1;
		 my.picX = pnt.x - (my.picSize - pnt.size)/2;
		 my.picY = pnt.y - (my.picSize - pnt.size)/2;
		 my.setThumUL_LI();
		 //my.infiniteLoop();
	 }
 });
};



// 変数リセット
sort_vertical.prototype.resetProperty = function(){
 this.openFlag = false;					//縦表示が開いているかどうかのFlag。これがtrueの場合、3Dサークルのスワイプが出来ない。
 //this.openStandbyFlag = false;		//縦表示OPENがスタンバイOKか否か。スタンバイfalseの場合は開かない。3Dサークルの物件名表示でtrueに。
 this.picSize = 0;
 this.picX = 0;
 this.picY = 0;
 this.hData = {};								//個の物件データ
 this.ThumDataList = [];					//個の物件の写真データリスト
 this.thumPathList = [];					//個の物件のサムネパスリスト
 
 this.swipMouseY01 = 0;					//スワイプ時のマウスY座標
 this.swipMouseY02 = 0;
 this.swipFlag = false;
 this.swipDist = 0;							////スワイプ時のマウスY移動距離
 
 this.topLI = {y:0, class:""};		//一番上に配置されたliのY座標とクラス名
 this.btmLI = {y:0, class:""};		//一番下に配置されたliのY座標とクラス名
};


//circle3d.jsから立ち上げ
sort_vertical.prototype.openThumbnail = function(na, pnt){
 //if(this.openStandbyFlag){
	 //this.openStandbyFlag = false;
	 this.openFlag = false;
	 
	 // c3dHideCheckMark(na);
	 // this.hData = XML_DATA.getHouseData(na);
	 // for(var i=0; i<this.hData.photos.length; i++){
	 // 	this.ThumDataList.push(this.hData.photos[i]);
	 // }
	 // SITE_NAVI.hideNavi();
	 
	 
	 //サムネパス情報を表示順に配列に設置→サムネ プリロード
	 // for(var i=0; i<this.ThumDataList.length; i++){
	 // 	this.thumPathList.push("images/"+this.hData.dre+"/"+this.ThumDataList[i].thumbnail);
	 // 	this.thumPathList.push("images/"+this.hData.dre+"/"+this.ThumDataList[this.ThumDataList.length-1-i].thumbnail);
	 // 	if(i+1 >= this.ThumDataList.length-1-i) break;
	 // }
	 IMG_PRELOAD.loadHouseSImg(this.thumPathList);
	 
	 
	 this.picSize = pnt.size*1.1;
	 this.picX = pnt.x - (this.picSize - pnt.size)/2;
	 this.picY = pnt.y - (this.picSize - pnt.size)/2;
	 
	 this.setThumbnail();
	 
	//  $("#siteNavi, #houseName").fadeOut(300);
	 // $("#sortVertical").show();
	 
	 $('.brand-info').show()


	 console.log(na)
	 console.log(pnt)

	 $('.brand-left img').attr('src', na.image)
	 $('.brand-text').text(na.desc)

	//  $("#sortVertical .return").fadeIn(300);
	 this.setThumUL_LI();
	 
	 //サークルの、選択されたサムネを隠す
	 // hideChoicedThumbnail();
	 
	 this.playStartAnima();
	 if(this.firstFlag) this.clickThumbnail();
	 
	 this.firstFlag = false;
 //}
};


//サムネイルのul, li サイズと位置をセット
sort_vertical.prototype.setThumUL_LI = function(){
 $("#sortVertical ul li").width(this.picSize).height(this.picSize);
 $("#sortVertical ul").width(this.picSize).height(this.picSize).offset({top:this.picY, left:this.picX});

 var maxCnt = Math.floor(this.ThumDataList.length/2);
 if(this.ThumDataList.length%2==0) maxCnt -= 1;
 for(var i=0; i<=maxCnt; i++){
	 $("#sortVertical ul li.thum"+String(i)).css("top",i*(-this.picSize*1.1)+"px");
	 if((this.ThumDataList.length%2==0 && i<=maxCnt) || (this.ThumDataList.length%2==1 && i<maxCnt)){
		 $("#sortVertical ul li.thum"+String(this.ThumDataList.length-1-i)).css("top",(i+1)*(this.picSize*1.1)+"px");
	 }
 }
 $("#sortVertical .tranceCover").width(this.picSize).offset({left:this.picX});
 this.setTopAndBottomLiData();
};


//サムネイルのul, li サイズと位置をセット（リサイズ用）
/*sort_vertical.prototype.setThumUL_LI_forResize = function(){
 $("#sortVertical ul li").width(this.picSize).height(this.picSize);

 var tp = $("#sortVertical ul").position().top;
 $("#sortVertical ul").width(this.picSize).height(this.picSize).offset({top:tp, left:this.picX});
 
 var maxCnt = Math.floor(this.ThumDataList.length/2);
 if(this.ThumDataList.length%2==0) maxCnt -= 1;
 for(var i=0; i<=maxCnt; i++){
	 $("#sortVertical ul li.thum"+String(i)).css("top",i*(-this.picSize*1.1)+"px");
	 if((this.ThumDataList.length%2==0 && i<=maxCnt) || (this.ThumDataList.length%2==1 && i<maxCnt)){
		 $("#sortVertical ul li.thum"+String(this.ThumDataList.length-1-i)).css("top",(i+1)*(this.picSize*1.1)+"px");
	 }
 }
 
 $("#sortVertical .tranceCover").width(this.picSize).offset({left:this.picX});
};*/


//サムネイルを配置
sort_vertical.prototype.setThumbnail = function(){
 for(var i=0; i<this.ThumDataList.length; i++){
	 var path = "images/"+this.hData.dre+"/"+this.ThumDataList[i].thumbnail;
	 $('<li class="thum'+String(i)+'"><img src="'+path+'" /></li>').appendTo("#sortVertical ul");
 }
 for(var i=0; i<this.ThumDataList.length; i++){
	 var className = $("#sortVertical ul li").eq(i).attr("class");
	 if(className == "thum0"){
		 $("#sortVertical ul li").eq(i).find("img").css({"width":"92%","height":"92%","margin-left":"4%","margin-top":"4%"});
	 }else{
		 $("#sortVertical ul li").eq(i).css("opacity","0");
		 //$("#sortVertical ul li").eq(i).find("img").css("opacity","0");
	 }
 }
};


//スタート時の動き
sort_vertical.prototype.playStartAnima = function(){
 var sPer = 92;
 var mgnPer = 4;
 var timerID = 0;
 var speed = 0.12;
 function animaLoop1(){
	 timerID = setTimeout(function(){
		 sPer += (100 - sPer)*speed;
		 mgnPer += (0 - mgnPer)*speed;
		 if(100 - sPer > 0.1){
			 $("#sortVertical ul li.thum0 img").css({"width":String(sPer)+"%","height":String(sPer)+"%","margin-left":String(mgnPer)+"%","margin-top":String(mgnPer)+"%"});
			 animaLoop1();
		 }else{
			 $("#sortVertical ul li.thum0 img").css({"width":"100%","height":"100%","margin-left":"0%","margin-top":"0%"});
			 //animaLoop2();
			 $("#sortVertical ul li").animate({opacity:1},300);
		 }
	 },1000/50);
 }
 animaLoop1();
 /*
 var maxCnt = this.ThumDataList.length;
 var cnt = 1;
 var opc = 0;
 function animaLoop2(){
	 
	 setTimeout(function(){
		 opc += 0.1;
		 $("#sortVertical ul li.thum"+cnt).css("opacity",opc);
		 if(maxCnt-cnt > cnt){
			 $("#sortVertical ul li.thum"+(maxCnt-cnt)).css("opacity",opc);
		 }
		 if($("#sortVertical ul li.thum"+cnt).css("opacity")>=1){
			 cnt++;
			 opc = 0;
		 }
		 if((cnt < maxCnt-cnt && maxCnt%2 == 1) || (cnt <= maxCnt-cnt && maxCnt%2 == 0)){
			 animaLoop2();
		 }
	 },1000/50);
 }
 */
};


//スワイプ設定
sort_vertical.prototype.setSwip = function(){
 var my = this;
 $("#sortVertical .tranceCover").on(onStart,function(ev){
	 //$("#sortVertical .tranceCover").show();
	 var rect = ev.target.getBoundingClientRect();
	 if(device=="pc"){
		 my.swipMouseY01 = ev.clientY - rect.top;
	 }else{
		 my.swipMouseY01 = ev.touches[0].clientY - rect.top;
	 }
	 my.swipFlag = true;
 });
 
 $("#sortVertical .tranceCover").on(onMove,function(ev){
	 //window.scrollTo(0,0);
	 if(my.swipFlag){
		 var rect = ev.target.getBoundingClientRect();
		 if(device=="pc"){
			 my.swipMouseY02 = ev.clientY - rect.top;
		 }else{
			 my.swipMouseY02 = ev.touches[0].clientY - rect.top;
		 }
		 my.swipDist = my.swipMouseY02 - my.swipMouseY01;
		 my.swipMouseY01 = my.swipMouseY02;
		 
		 var topPosition = $("#sortVertical ul").position().top;
		 $("#sortVertical ul").css("top",topPosition+my.swipDist+"px");
		 
		 my.infiniteLoop();
	 }
 });
 
 // $("#sortVertical").on(onEnd,function(ev){
 // 	if(!my.swipFlag) my.clickReturnBtn();
 // 	my.swipFlag = false;
 // 	my.animateSwipFinish();
 // 	//$("#sortVertical .tranceCover").hide();
 // });
};


//サムネの無限ループ：サムネ移動中に呼び出す
sort_vertical.prototype.infiniteLoop = function(){
 var wh = $(window).innerHeight();
 var topElem = $("#sortVertical ul li."+this.topLI.class);
 var btmElem = $("#sortVertical ul li."+this.btmLI.class);
 this.topLI.y = topElem.position().top;
 this.btmLI.y = btmElem.position().top;
 var n = 0;
 
 //最下部のサムネを最上部に移動（下方向に移動中）
 if(topElem.offset().top > 0 - this.picSize/2 && this.swipDist > 0){
	 $("#sortVertical ul li."+this.btmLI.class).css("top",this.topLI.y - this.picSize*1.1+"px");
	 this.topLI.y = this.topLI.y - this.picSize*1.1;
	 this.topLI.class = this.btmLI.class;
	 n = Number(this.btmLI.class.substr(4));
	 n += 1;
	 if(n >= this.ThumDataList.length) n = 0;
	 this.btmLI.class = "thum"+n;
 }
 
 //最上部のサムネを最下部に移動（上方向に移動中）
 if(btmElem.offset().top < wh - this.picSize/2 && this.swipDist < 0){
	 $("#sortVertical ul li."+this.topLI.class).css("top",this.btmLI.y + this.picSize*1.1+"px");
	 this.btmLI.y = this.btmLI.y + this.picSize*1.1;
	 this.btmLI.class = this.topLI.class;
	 n = Number(this.topLI.class.substr(4));
	 n -= 1;
	 if(n < 0) n = this.ThumDataList.length - 1;
	 this.topLI.class = "thum"+n;
 }
 
};


//最上部と最下部のサムネを調べてオブジェクトにセット
sort_vertical.prototype.setTopAndBottomLiData = function(){
 for(var i=0; i<this.ThumDataList.length; i++){
	 var liY = $("#sortVertical ul li").eq(i).position().top;
	 this.topLI.y = Math.min(this.topLI.y, liY);
	 this.btmLI.y = Math.max(this.btmLI.y, liY);
	 if(liY == this.topLI.y) this.topLI.class = $("#sortVertical ul li").eq(i).attr("class");
	 if(liY == this.btmLI.y) this.btmLI.class = $("#sortVertical ul li").eq(i).attr("class");
 }
};


//スワイプの余韻
sort_vertical.prototype.animateSwipFinish = function(){
 this.swipDist *= 0.96;
 var my = this;
 setTimeout(function(){
	 var topPosition = $("#sortVertical ul").position().top;
	 $("#sortVertical ul").css("top",topPosition+my.swipDist+"px");
	 my.swipDist *= 0.98;
	 my.infiniteLoop();
	 
	 if(Math.abs(my.swipDist)>0.1){
		 my.animateSwipFinish();
	 }else{
		 my.swipDist = 0;
	 }
 },1000/60);
};



//サムネClick
sort_vertical.prototype.clickThumbnail = function(){
 var my = this;
 
 if(device=="pc"){
 $("#sortVertical .tranceCover").on(onMove, function(ev){
	 var mPnt = {x:0, y:0};
	 var hitLiImageSrc = "";
	 if(device=="pc"){
		 mPnt.x = ev.clientX;
		 mPnt.y = ev.clientY;
	 }else{
		 mPnt.x = ev.touches[0].clientX;
		 mPnt.y = ev.touches[0].clientY;
	 }
	 for(var i=0; i<$("#sortVertical ul li").length; i++){
		 var targetLi = $("#sortVertical ul li").eq(i);
		 var offset = targetLi.offset();
		 if(mPnt.x >= offset.left && mPnt.x <= offset.left+my.picSize && mPnt.y >= offset.top && mPnt.y <= offset.top+my.picSize){
			 hitLiImageSrc = targetLi.find("img").attr("src");
			 $(this).css("cursor","pointer");
			 break;
		 }else{
			 $(this).css("cursor","default");
		 }
	 }
 });
 }
 
 var start_mPnt = {x:0, y:0};
 var end_mPnt = {x:0, y:0};
 $("#sortVertical .tranceCover").on(onStart, function(ev){
	 var moveDist = 0;
	 
	 if(device=="pc"){
		 start_mPnt.x = ev.clientX;
		 start_mPnt.y = ev.clientY;
	 }else{
		 start_mPnt.x = ev.touches[0].clientX;
		 start_mPnt.y = ev.touches[0].clientY;
	 }
 });
	 
 $("#sortVertical .tranceCover").on(onEnd, function(ev){
	 var hitLiImageSrc = "";
	 var hitLiImageNum = 0;
	 if(device=="pc"){
		 end_mPnt.x = ev.clientX;
		 end_mPnt.y = ev.clientY;
	 }else{
		 end_mPnt.x = ev.changedTouches[0].clientX;
		 end_mPnt.y = ev.changedTouches[0].clientY;
	 }
	 
	 if(Math.abs(end_mPnt.x-start_mPnt.x)<5 && Math.abs(end_mPnt.y-start_mPnt.y)<5){
		 for(var i=0; i<$("#sortVertical ul li").length; i++){
			 var targetLi = $("#sortVertical ul li").eq(i);
			 var offset = targetLi.offset();
			 if(end_mPnt.x >= offset.left && end_mPnt.x <= offset.left+my.picSize && end_mPnt.y >= offset.top && end_mPnt.y <= offset.top+my.picSize){
				 hitLiImageSrc = targetLi.find("img").attr("src");
				 hitLiImageNum = targetLi.attr("class").substr(4)*1;
				 break;
			 }
		 }
		 //拡大画面立ち上げ処理
		 VIEW_PHOTO.openView("house",hitLiImageNum, my.hData);
	 }
 });
 
};


//戻るボタン設置
sort_vertical.prototype.setReturnBtn = function(){
 var my = this;
 $("#sortVertical .return img").on(onEnd, function(){
	 my.clickReturnBtn();
 });
};


//戻るボタンClick
sort_vertical.prototype.clickReturnBtn = function(){
 var my = this;
	 var leng = $("#sortVertical ul li").length;
	 for(var i=0; i<leng; i++){
		 var endX = $("#sortVertical ul li").eq(i).position().left + $("#sortVertical ul li").eq(i).width()/2;
		 var endY = $("#sortVertical ul li").eq(i).position().top + $("#sortVertical ul li").eq(i).height()/2;
		 var tm = 500;
		 $("#sortVertical ul li").eq(i).animate({width:"1px",height:"1px", left:endX+"px", top:endY+"px"},tm,"swing",function(){
			 var i2 = $("#sortVertical ul li").index(this);
			 if(i2==0){
				 $("#sortVertical").hide();
				 c3dShowCheckMark(my.hData.dre);
				 my.resetProperty();
				//  $("#siteNavi, #houseName").fadeIn(300);
				 
				 //サークルのセンターサムネを表示
				 showChoicedThumbnail();
			 }
			 
		 });
		 setTimeout(function(){
			 $("#sortVertical ul li").remove();
		 },tm+50);
	 }
	 $("#sortVertical .return").fadeOut(300,function(){
		 SITE_NAVI.showNavi();
	 });
};


//写真拡大表示を解除したときの処理 view_photo.js から呼び出し
sort_vertical.prototype.clearThum_forViewPhoto = function(){
 $("#sortVertical ul li").remove();
 $("#sortVertical").hide();
 c3dShowCheckMark(this.hData.dre);
 this.resetProperty();
//  $("#siteNavi, #houseName").fadeIn(300);
 
 //サークルのセンターサムネを表示
 setTimeout(function(){
	 showChoicedThumbnail();
	 $("#sortVertical .return").hide();
 },500);
};


	 


 

