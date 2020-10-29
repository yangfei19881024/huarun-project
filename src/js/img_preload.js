$(function(){
	IMG_PRELOAD = new imgPreload();
});


var imgPreload = function(){
	this.cnt = 0;
	this.cntMax = 0;
	this.pathList = new Array();
	this.fixFlag = false;
}


//物件サムネイルの先読み
imgPreload.prototype.loadHouseSImg = function(list){
	//console.log(list);
	var my = this;
	this.pathList = [];
	this.pathList = list;
	//console.log(this.pathList);
	this.cntMax = list.length;
	this.cnt = 0;
	this.fixFlag = false;
	this.loopLoadImg();
};


imgPreload.prototype.loopLoadImg = function(){
	var my = this;
	var img = new Image();
	img.src = my.pathList[my.cnt];
	img.onload = function(){
		//console.log(this.src);
		my.cnt++;
		if(my.cnt<my.cntMax){
			my.loopLoadImg(my.cnt);
		}else{
			my.fixFlag = true;
			setTimeout(function(){
				$('.loading').remove();
			}, 1200)
		}
	}
};





