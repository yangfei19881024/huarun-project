
//site navi

//var onStart,onEnd,onMove;

if(device=="sp"){
var audioContext;
var audioBufferLoader;
var audioBufferList;
var audioGainNode;
}

$(function(){
	SOUND = new siteSound();
});


var siteSound = function(){
	var my = this;
	
	if(device=="sp"){
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	my.volume = 0;
	audioContext = new AudioContext();
	
	audioBufferLoader = new BufferLoader(
		audioContext,
		[
			"sound/house_name_show.mp3",
			"sound/search_btn_click.mp3",
			"sound/nav.mp3",
			"sound/return_click.mp3",
			"sound/thum_click.mp3",
			"sound/view_photo_btn_click.mp3"
		],
		function(bufferList){
			audioBufferList = bufferList;
			
			my.snd1 = audioContext.createBufferSource();
			my.snd2 = audioContext.createBufferSource();
			my.snd3 = audioContext.createBufferSource();
			my.snd4 = audioContext.createBufferSource();
			my.snd5 = audioContext.createBufferSource();
			my.snd6 = audioContext.createBufferSource();
			
			my.snd1.buffer = audioBufferList[0];
			my.snd2.buffer = audioBufferList[1];
			my.snd3.buffer = audioBufferList[2];
			my.snd4.buffer = audioBufferList[3];
			my.snd5.buffer = audioBufferList[4];
			my.snd6.buffer = audioBufferList[5];
			
			audioGainNode = audioContext.createGain();
			my.snd1.connect(audioGainNode);
			my.snd2.connect(audioGainNode);
			my.snd3.connect(audioGainNode);
			my.snd4.connect(audioGainNode);
			my.snd5.connect(audioGainNode);
			my.snd6.connect(audioGainNode);
			audioGainNode.connect(audioContext.destination);
			
			audioGainNode.gain.value = my.volume;
			
			my.snd1.connect(audioContext.destination);
			my.snd1.start(0);
			
			//my.volume = 0;
		}
	);
	
	}else if(device=="pc"){
	
	this.searchBtn = new Audio();
	this.nav = new Audio();
	this.return = new Audio();
	this.thumClick = new Audio();
	this.viewPhotoBtn = new Audio();
	this.houseNameShow = new Audio();
	
	this.searchBtn.preload = "auto";
	this.nav.preload = "auto";
	this.return.preload = "auto";
	this.thumClick.preload = "auto";
	this.viewPhotoBtn.preload = "auto";
	this.houseNameShow.preload = "auto";
	
	this.searchBtn.src = "sound/search_btn_click.mp3";
	this.nav.src = "sound/nav.mp3";
	this.return.src = "sound/return_click.mp3";
	this.thumClick.src = "sound/thum_click.mp3";
	this.viewPhotoBtn.src = "sound/view_photo_btn_click.mp3";
	this.houseNameShow.src = "sound/house_name_show.mp3";
	
	this.soundList = [this.houseNameShow,this.thumClick,this.nav,this.searchBtn,this.return,this.viewPhotoBtn];
	
	setTimeout(function(){
		my.loadAllSound();
	},1000);
	
	}

};


siteSound.prototype.loadAllSound = function(){
	var my = this;
	
	if(device=="sp"){
		audioBufferLoader.load();
	}else if(device=="pc"){
		this.houseNameShow.load();
		this.houseNameShow.volume = 0;
		this.houseNameShow.play();
	}

};




siteSound.prototype.playSearchBtn = function(){
	var my = this;
	
	if(device=="sp"){
		my.snd2 = audioContext.createBufferSource();
		my.snd2.buffer = audioBufferList[1];
		my.snd2.connect(audioContext.destination);
		
		audioGainNode = audioContext.createGain();
		my.snd2.connect(audioGainNode);
		audioGainNode.connect(audioContext.destination);
		audioGainNode.gain.value = my.volume;
		
		my.snd2.start(0);
	
	}else if(device=="pc"){
		this.searchBtn.play();
	}
};


siteSound.prototype.playNav = function(){
	var my = this;
	
	if(device=="sp"){
		my.snd3 = audioContext.createBufferSource();
		my.snd3.buffer = audioBufferList[2];
		my.snd3.connect(audioContext.destination);
		
		audioGainNode = audioContext.createGain();
		my.snd3.connect(audioGainNode);
		audioGainNode.connect(audioContext.destination);
		audioGainNode.gain.value = my.volume;
		
		my.snd3.start(0);
	}else if(device=="pc"){
		this.nav.play();
	}
};


siteSound.prototype.playReturn = function(){
	var my = this;
	
	if(device=="sp"){
		my.snd4 = audioContext.createBufferSource();
		my.snd4.buffer = audioBufferList[3];
		my.snd4.connect(audioContext.destination);
		
		audioGainNode = audioContext.createGain();
		my.snd4.connect(audioGainNode);
		audioGainNode.connect(audioContext.destination);
		audioGainNode.gain.value = my.volume;
		
		my.snd4.start(0);
	}else if(device=="pc"){
		this.return.play();
	}
};


siteSound.prototype.playThumClick = function(){
	var my = this;
	
	if(device=="sp"){
		my.snd5 = audioContext.createBufferSource();
		my.snd5.buffer = audioBufferList[4];
		my.snd5.connect(audioContext.destination);
		
		audioGainNode = audioContext.createGain();
		my.snd5.connect(audioGainNode);
		audioGainNode.connect(audioContext.destination);
		audioGainNode.gain.value = my.volume;
		
		my.snd5.start(0);
	}else if(device=="pc"){
		this.thumClick.play();
	}
};


siteSound.prototype.playViewPhotoBtn = function(){
	var my = this;
	
	if(device=="sp"){
		my.snd6 = audioContext.createBufferSource();
		my.snd6.buffer = audioBufferList[5];
		my.snd6.connect(audioContext.destination);
		
		audioGainNode = audioContext.createGain();
		my.snd6.connect(audioGainNode);
		audioGainNode.connect(audioContext.destination);
		audioGainNode.gain.value = my.volume;
		
		my.snd6.start(0);
	}else if(device=="pc"){
		this.viewPhotoBtn.play();
	}
};


siteSound.prototype.playHouseNameShow = function(){
	var my = this;
	
	if(device=="sp"){
		my.snd1 = audioContext.createBufferSource();
		my.snd1.buffer = audioBufferList[0];
		my.snd1.connect(audioContext.destination);
		
		audioGainNode = audioContext.createGain();
		my.snd1.connect(audioGainNode);
		audioGainNode.connect(audioContext.destination);
		audioGainNode.gain.value = my.volume;
		
		my.snd1.start(0);
	}else if(device=="pc"){
		this.houseNameShow.volume = 1;
		this.houseNameShow.play();
	}
};


siteSound.prototype.soundON = function(){
	var my = this;
	if(device=="sp"){
		my.volume = 0;
	}else if(device=="pc"){
		this.searchBtn.muted = false;
		this.nav.muted = false;
		this.return.muted = false;
		this.thumClick.muted = false;
		this.viewPhotoBtn.muted = false;
		this.houseNameShow.muted = false;
	}
};


siteSound.prototype.soundOFF = function(){
	var my = this;
	if(device=="sp"){
		my.volume = -1;
	}else if(device=="pc"){
		this.searchBtn.muted = true;
		this.nav.muted = true;
		this.return.muted = true;
		this.thumClick.muted = true;
		this.viewPhotoBtn.muted = true;
		this.houseNameShow.muted = true;
	}
};



