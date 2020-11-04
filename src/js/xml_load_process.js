$(function(){
	
	XML_DATA = new xmlLoadProcess(window.tech_finance);
	
});

function xmlLoadProcess(data){
	// this.data = data;
	this.initData(data)
	
}

xmlLoadProcess.prototype.initData = function(datas){
	var my = this;
	//var date = new Date();
	//var today = "?d="+date.getDate()+date.getHours();
	
	var jsPath = $("#xmlJs").attr("src");
	var jsPathWordNum = jsPath.indexOf("?");
	var cashNum = jsPath.substr(jsPathWordNum);
	//console.log(cashNum);
	
	this.houseList = [];	//XMLデータをリスト化、オブジェクト化して格納
	this.dataProcessed = false;		//XMLデータが処理されたかどうか


	// 本地获取图片
	this.houseList = datas.map(function(item){
		return {
			name: item.name,
			image: item.image,
			logo: item.logo,
			title: item.title,
			desc: item.desc,
			view: true
		}
	})
	console.log('最新的数据')
	console.log(this.houseList)
	// 本地获取图片end

	this.dataProcessed = true;
			//---注释掉---
  IMG_PRELOAD.loadHouseSImg(this.getHouseSImgURL());

};


//物件サムネール画像リスト取得
xmlLoadProcess.prototype.getHouseSImgURL = function(){
	
	var sImgList = [];
	for(var i=0; i<this.houseList.length; i++){
		if(this.houseList[i].view == true){
			var path = this.houseList[i].logo+"?a=150";
			sImgList.push(path);
		}
	}
	console.log("sImgList")
	console.log(sImgList)
	return sImgList;
};


//物件データのソート1-20を手前に、それ以外はランダム
xmlLoadProcess.prototype.sortData = function(){
	this.houseList.sort(function(a,b){
		if(a.viewnum < b.viewnum) return -1;
		if(a.viewnum > b.viewnum) return 1;
		return 0;
	});
	//console.log(this.houseList);
	var topNum = [];
	var btmNum = [];
	var randomNum = [];
	var finishList = [];
	
	for(var i=0; i<this.houseList.length; i++){
		if(i % 2 == 0 && this.houseList[i].viewnum < 999){
			topNum.push(this.houseList[i]);
		}else if(i % 2 == 1 && this.houseList[i].viewnum < 999){
			btmNum.unshift(this.houseList[i]);
		}else if(this.houseList[i].viewnum == 999){
			randomNum.push(this.houseList[i]);
		}
	}
	
	//viewnumが999のデータをランダムに
	for(var i=randomNum.length-1; i>=0; i--){
		var rand = Math.floor( Math.random() * ( i + 1 ) );
		var randVal = randomNum[rand];
		var iVal = randomNum[i];
		randomNum[rand] = iVal;
		randomNum[i] = randVal;
	}
	
	for(var i=0; i<topNum.length; i++){
		finishList.push(topNum[i]);
	}
	for(var i=0; i<randomNum.length; i++){
		finishList.push(randomNum[i]);
	}
	for(var i=0; i<btmNum.length; i++){
		finishList.push(btmNum[i]);
	}
	
	//console.log(finishList);
	return finishList;
};


//物件ディレクトリ名から物件データを取得
xmlLoadProcess.prototype.getHouseData = function(dre){
	var n=0;
	for(var i=0; i<this.houseList.length; i++){
		if(this.houseList[i].dre == dre){
			n = i;
			break;
		}
	}
	return this.houseList[n];
};
/*xmlLoadProcess.prototype.getHouseData_forSpaceType = function(thumbnail){
	var n=0;
	for(var i=0; i<this.houseList.length; i++){
		if(this.houseList[i].dre == dre){
			n = i;
			break;
		}
	}
	return this.houseList[n];
};*/



//物件名リストをアルファベット順に並べて取得
xmlLoadProcess.prototype.getSortNameAndDre_Alphabet = function(){
	var list = [];
	for(var i=0; i<this.houseList.length; i++){
		var obj = {name:this.houseList[i].name, dre:this.houseList[i].dre, new:this.houseList[i].new};
		list.push(obj);
	}
	
	//アルファベット順にソート
	list.sort(function(a,b){
		var a2 = a.name.toString().toLowerCase();
		var b2 = b.name.toString().toLowerCase();
		if(b2 < a2) return 1;
		else if(b2 > a2) return -1;
		return 0;
	});
	
	return list;
};


//西暦で絞り込んだときのデータリスト
xmlLoadProcess.prototype.getYearSearchData = function(year){
	//year = "2011-2015"等
	var my = this;
	var yearMin = year.split("-")[0]*1;
	var yearMax = year.split("-")[1]*1;
	var dataList = [];
	
	for(var i=0; i<my.houseList.length; i++){
		if(my.houseList[i].year>=yearMin && my.houseList[i].year<=yearMax){
			dataList.push(my.houseList[i]);
		}
	}
	
	//viewnum順にソート
	dataList.sort(function(a,b){
		if(a.viewnum > b.viewnum) return 1;
		else if(a.viewnum < b.viewnum) return -1;
		return 0;
	});
	
	//西暦順の新しい順にソート
	dataList.sort(function(a,b){
		if(a.year < b.year) return 1;
		else if(a.year > b.year) return -1;
		return 0;
	});
	
	return dataList;
}


//スペースで絞り込んだ時のデータリスト
xmlLoadProcess.prototype.getSpaceSearchData = function(space){
	//space = "livingroom"等
	var my = this;
	var dataList = [];
	
	for(var i=0; i<my.houseList.length; i++){
		var houseData = my.houseList[i];
		for(var j=0; j<houseData.photos.length; j++){
			var spaceWords = houseData.photos[j].space;
			if(spaceWords.indexOf(space) >= 0){
				houseData.photos[j].name = houseData.name;
				houseData.photos[j].subname = houseData.subname;
				houseData.photos[j].dre = houseData.dre;
				houseData.photos[j].year = houseData.year;
				houseData.photos[j].viewnum = houseData.viewnum;
				houseData.photos[j].new = houseData.new;
				houseData.photos[j].view = houseData.view;
				houseData.photos[j].check = houseData.check;
				dataList.push(houseData.photos[j]);
			}
		}
	}
	//console.log(dataList);
	
	//データの並び順をソート
	dataList.sort(function(a,b){
		if(a.viewnum < b.viewnum) return -1;
		if(a.viewnum > b.viewnum) return 1;
		return 0;
	});
	
	var dataListR = [];		//先頭
	var dataListL = [];		//末尾
	var RLFlagList = ["L",""];		//["L","089_ku_house"] ["R","089_ku_house"]
	$.each(dataList, function(index, obj){
		if(index==0){
			dataListR.push(obj);
			RLFlagList[0] = "R";
			RLFlagList[1] = obj.dre;
			return true;
		}
		if(obj.dre==RLFlagList[1] && RLFlagList[0]=="R"){
			dataListR.push(obj);
			RLFlagList[0] = "R";
		}else if(obj.dre==RLFlagList[1] && RLFlagList[0]=="L"){
			dataListL.unshift(obj);
			RLFlagList[0] = "L";
		}else if(RLFlagList[0]=="R"){
			dataListL.unshift(obj);
			RLFlagList[0] = "L";
		}else if(RLFlagList[0]=="L"){
			dataListR.push(obj);
			RLFlagList[0] = "R";
		}
		RLFlagList[1] = obj.dre;
	});
	
	return dataListR.concat(dataListL);
};


//閲覧済み物件のcheckをtrueに
xmlLoadProcess.prototype.changeCheckProperty = function(dre){
	var my = this;
	//my.houseList;
	for(var i=0; i<my.houseList.length; i++){
		if(my.houseList[i].dre == dre){
			my.houseList[i].check = true;
			break;
		}
	}
};







