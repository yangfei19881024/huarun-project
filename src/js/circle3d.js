var thumImgPathList = [];		//サークルにセットされた画像パスのリスト
var baseThumImgPathList = [];			//デフォルトサークルにセットされた画像パスのリスト
var circle3dStartFlag = false;
var count = 0
function circle3d_firstStart(){
	count = count + 1
	console.log("circle3d_firstStart-->count:"+ count)
	/*---------three処理--------------*/
	stageW = $(window).innerWidth();
	stageH = $(window).innerHeight();
	targetElem = "circle3d";
		
	//シーン
  scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0x000000,300,5500);	//カメラから離れるほど物体が霞む
	
	//カメラ
	camera = new THREE.PerspectiveCamera(45, stageW / stageH, 1, 10000);
	//camera.position.set(0,120,1400);
	camera.position.set(0,2800,3500);
	scene.add( camera );
	nowLookAtX = 0;
	nowLookAtY = 0;
	nowLookAtZ = 0;
	//camera.lookAt(new THREE.Vector3(nowLookAtX, nowLookAtY, nowLookAtZ));
	
	//カメラぐりぐり
	//trackball = new THREE.TrackballControls( camera );
	
	//ライティング
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 ); //平行光源（色、強度）
  directionalLight.position.set(1,6,2);
  scene.add( directionalLight );
	
	var ambientLight = new THREE.AmbientLight( 0xffffff,1); // 環境光（色、強度）
	scene.add( ambientLight );
	
	/*======================*/
	
	
	
	// XML_DATA.houseList = XML_DATA.sortData();
	
	boxNum = XML_DATA.houseList.length;
	boxArray = new Array(boxNum);
	boxArrayMirror = new Array(boxNum);
	boxs = new THREE.Group();
	boxSize = 71;
	hankei = ((boxSize*boxArray.length)*1.1)/Math.PI/2;
	
	baseThumImgPathList = XML_DATA.getHouseSImgURL();
	thumImgPathList = XML_DATA.getHouseSImgURL();
	//console.log(thumImgPathList);
	
	for(var i=0; i<boxArray.length; i++){
		var texloader = new THREE.TextureLoader();	//マッピングテクスチャ
		var tex =texloader.load(thumImgPathList[i]);
		
		var geometry = new THREE.PlaneGeometry(boxSize, boxSize, 0);	//幅, 高さ, 奥行き
		var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map:tex, transparent:true, opacity:1 });	//色
		material.side = THREE.DoubleSide;
		boxArray[i] = new THREE.Mesh(geometry, material);
		var radian = (360/boxArray.length)*(Math.PI/180)*i;
		var x = Math.sin(radian)*hankei;
		var y = 0;
		var z = Math.cos(radian)*hankei;
		boxArray[i].position.set(x,y,z);
		boxArray[i].rotation.set(0,radian,0);
		boxArray[i].name = XML_DATA.houseList[i].dre;
		boxArray[i].image = XML_DATA.houseList[i].image;
		boxArray[i].desc = XML_DATA.houseList[i].desc;
		boxArray[i].title = XML_DATA.houseList[i].title;
		
		//映り込み
		var geometryM = new THREE.PlaneGeometry(boxSize, boxSize, 0);	//幅, 高さ, 奥行き
		var materialM = new THREE.MeshBasicMaterial({ color: 0xffffff, map:tex, transparent:false, opacity:1 });	//色
		materialM.side = THREE.DoubleSide;
		boxArrayMirror[i] = new THREE.Mesh(geometryM, materialM);
		y = y-boxSize;
		boxArrayMirror[i].position.set(x,y,z);
		boxArrayMirror[i].scale.y = boxArrayMirror[i].scale.y*(-1);
		//boxArrayMirror[i].scale.x = boxArrayMirror[i].scale.x*(-1);
		boxArrayMirror[i].rotation.set(0,radian,0);
		boxArrayMirror[i].name = XML_DATA.houseList[i].dre+"_M";
		
		boxs.add(boxArray[i]);
		boxs.add(boxArrayMirror[i]);
		scene.add(boxs);
		boxs.rotation.y = 350*Math.PI/180;
		boxs.rotation.z = 18*Math.PI/180;
		
		//scene.add(boxArray[i]);
		//scene.add(boxArrayMirror[i]);
	}
	
	
	
	//レンダラー
  renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
  renderer.setSize( stageW, stageH );
	renderer.setClearColor(0xffffff, 0);
  document.getElementById(targetElem).appendChild(renderer.domElement);
	
	$("#"+targetElem).fadeIn(300);
	

	
	//マウスクリック
	c3dStartMouse = { x: 0, y: 0 };
	c3dStartMouse2 = { x: 0, y: 0 };
	c3dMoveMouse = { x: 0, y: 0 };
	c3dMoveMouse2 = { x: 0, y: 0 };
	c3dEndMouse = { x: 0, y: 0 };
	targetBox=false;
	c3dMouseDownFlag = false;
	c3dSwipEndMoveR = 0;		//Circleスワイプ後の動き（ラジアン）
	c3dMouseActLockFlag = true;		//3Dサークルのマウスアクションを制御
	
	$("#"+targetElem).on(onStart,function(ev){
		
		//console.log("SORT_VERTICAL.openFlag : "+SORT_VERTICAL.openFlag);
		//console.log("c3dMouseActLockFlag : "+c3dMouseActLockFlag);
		if (ev.target == renderer.domElement && !SORT_VERTICAL.openFlag && !c3dMouseActLockFlag){
			c3dMouseDownFlag = checkHitBox(ev,"start",0);
			c3dSwipEndMoveR = 0;
			//SOUND.houseNameShow.volume = 0.001;
			//SOUND.houseNameShow.play();
			
		}
	});
	
	$("#"+targetElem).on(onMove,function(ev){
		// console.log('move-->')
		// console.log(c3dMouseDownFlag)
		// console.log(!SORT_VERTICAL.openFlag)
		if(c3dMouseDownFlag && !SORT_VERTICAL.openFlag){
			//SORT_VERTICAL.openStandbyFlag = false;
			cancelBoxsRotation();
			//マウス座標2D変換
			c3dMoveMouse2.x = c3dMoveMouse.x;
			var rect = ev.target.getBoundingClientRect();
			if(device=="pc"){
				c3dMoveMouse.x =  ev.clientX - rect.left;
			}else{
				c3dMoveMouse.x =  ev.touches[0].clientX - rect.left;
			}
			
			var distX = c3dMoveMouse.x - c3dMoveMouse2.x;
			var enshu = hankei*2*Math.PI;
			c3dSwipEndMoveR = (distX/enshu)*360*Math.PI/180;
			boxs.rotation.y += c3dSwipEndMoveR*(1-stageH*0.00052);	//stageの縦サイズによってスワイプの移動幅が変わってくるので調整
			clearChoiceBox();
		}
	});
	
	$("#"+targetElem).on(onEnd,function(ev){
		
		if(c3dMouseDownFlag && !SORT_VERTICAL.openFlag){
			c3dSwipAnimate();
			c3dMouseDownFlag = false;
			
			//cancelAnimationFrame(animateID);
		}
	});
	
	
	
	
	animate();
	circleAnimateOpeningCamera();
	circleAnimateOpeningBoxs();
	
	//SOUND.playThumRotation();
	circle3dStartFlag = true;
}


//window リサイズ
$(window).resize(function(){
	if(circle3dStartFlag){
		stageW = $(window).innerWidth();
		stageH = $(window).innerHeight();
		camera.aspect = stageW/stageH;
		camera.updateProjectionMatrix();
		renderer.setSize(stageW,stageH);
	}
});


//マウス座標2D変換 BOXにヒットしたかどうか
function checkHitBox(ev,evType,choiceObj){	//evType:"start, end, move"
			var flag = false;
			//マウス座標2D変換
			var rect = ev.target.getBoundingClientRect();
			if(device=="pc"){
				c3dStartMouse.x = ev.clientX - rect.left;
				c3dStartMouse.y = ev.clientY - rect.top;
			}else if(device=="sp" && (evType=="start" || evType=="move")){
				c3dStartMouse.x = ev.touches[0].clientX - rect.left;
				c3dStartMouse.y = ev.touches[0].clientY - rect.top;
			}else if(device=="sp" && evType=="end"){
				c3dStartMouse.x = ev.changedTouches[0].clientX - rect.left;
				c3dStartMouse.y = ev.changedTouches[0].clientY - rect.top;
			}
			c3dStartMouse2.x = c3dStartMouse.x;
			c3dStartMouse2.y = c3dStartMouse.y;
			
			//マウス座標3D変換
			c3dStartMouse.x =  (c3dStartMouse.x / stageW) * 2 - 1;
			c3dStartMouse.y = -(c3dStartMouse.y / stageH) * 2 + 1;
			
			// マウスベクトル
			var vector = new THREE.Vector3( c3dStartMouse.x, c3dStartMouse.y ,1);
			
			// vector はスクリーン座標系なので, オブジェクトの座標系に変換
			vector.unproject(camera);
			
			// 始点, 向きベクトルを渡してレイを作成
			var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
			
			// レイとBOXの交差判定
			var objs = ray.intersectObjects( boxArray );
			
			// 交差していた場合の処理
			if ( objs.length > 0 ){
				if(device=="pc"){
					c3dMoveMouse.x =  ev.clientX - rect.left;
				}else if(device=="sp" && (evType=="start" || evType=="move")){
					c3dMoveMouse.x =  ev.touches[0].clientX - rect.left;
				}else if(device=="sp" && evType=="end"){
					c3dMoveMouse.x =  ev.changedTouches[0].clientX - rect.left;
				}
				flag = true;
				//c3dMouseDownFlag = true;
				
				//クリックしたBoxの名前を調べる
				if(choiceObj != 0){
					for(var i=0; i<boxArray.length; i++){
						if(objs[0].object.name == choiceObj.name){
							//targetBox = boxArray[i];
							flag = true;
							break;
						}else{
							flag = false;
						}
					}
				}
				return flag;
				
			}
}





/*-------------チェックマーク---------------*/
/*--------------------------------------------*/
var checkArray = [];

//拡大画像解除後のチェックマークセット
function c3dSetCheckMark(dre){
	var flag = false;
	
	for(var i=0; i<checkArray.length; i++){
		if(checkArray[i].name==dre+"_c"){
			flag = true;
			break;
		}
	}
	
	for(var i=0; i<boxArray.length; i++){
		if(boxArray[i].name == dre){
			flag = false;
			break;
		}else{
			flag = true;
		}
	}
	
	if(!flag){
		var leng = checkArray.length;
		var clickedBox  = scene.getObjectByName(dre);
		var boxX = clickedBox.position.x;
		var boxY = clickedBox.position.y;
		var boxZ = clickedBox.position.z;
		var deg = Math.atan2(boxX,boxZ)*180/Math.PI;
		//var cHankei = hankei+5;
		var cHankei = Math.sqrt(Math.pow(hankei,2)+Math.pow(boxSize/2,2))+0.5;
		var enshu = cHankei*2*Math.PI;	//円周
		var plusDeg = ((boxSize*0.32)/enshu)*360;
		var radian = (deg+plusDeg)*Math.PI/180;
		var rotaY = clickedBox.rotation.y;
		
		var texloader = new THREE.TextureLoader();	//マッピングテクスチャ
		var tex =texloader.load("images/check_mark.png");
		
		var geometry = new THREE.PlaneGeometry(boxSize*0.25, boxSize*0.25, 0);	//幅, 高さ, 奥行き
		var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map:tex, transparent:true, opacity:1 });	//色
		material.side = THREE.DoubleSide;
		checkArray[leng] = new THREE.Mesh(geometry, material);
		
		boxs.add(checkArray[leng]);
		
		var x = Math.sin(radian)*cHankei;
		var y = 36;
		var z = Math.cos(radian)*cHankei;
		var sc = 0.01;
		checkArray[leng].position.set(x,y,z);
		checkArray[leng].rotation.set(0,rotaY,0);
		checkArray[leng].scale.set(sc,sc,1);
		checkArray[leng].name = dre+"_c";
		
		var loopID;
		var loopCnt=0;
		var loop = function(){
			loopCnt++;
			if(sc<0.99 && loopCnt>30){
				sc += (1-sc)*0.05;
				checkArray[leng].scale.set(sc,sc,1);
				loopID = setTimeout(loop,1/60);
			}else if(loopCnt>30){
				sc=1;
				checkArray[leng].scale.set(sc,sc,1);
				clearTimeout(loopID);
			}else{
				loopID = setTimeout(loop,1/60);
			}
		};
		loop();
	}
}

//手前のBOXのチェックマークを隠す
function c3dHideCheckMark(dre){
	var flag = false;
	var clickedBox;
	for(var i=0; i<checkArray.length; i++){
		if(checkArray[i].name==dre+"_c"){
			flag = true;
			clickedBox = checkArray[i];
			break;
		}
	}
	
	if(flag){
		var op = 1;
		var loopID;
		var loop = function(){
			op -= 0.01;
			if(op>0){
				clickedBox.material.opacity = op;
				loopID = setTimeout(loop,1/60);
			}else{
				clickedBox.material.opacity = 0;
				clearTimeout(loopID);
			}
		};
		loop();
	}
}

//手前のBOXのチェックマークを表示する
function c3dShowCheckMark(dre){
	var flag = false;
	var clickedBox;
	for(var i=0; i<checkArray.length; i++){
		if(checkArray[i].name==dre+"_c"){
			flag = true;
			clickedBox = checkArray[i];
			break;
		}
	}
	
	if(flag){
		var op = 0;
		var loopID;
		var loop = function(){
			op += 0.01;
			if(op<1){
				clickedBox.material.opacity = op;
				loopID = setTimeout(loop,1/60);
			}else{
				clickedBox.material.opacity = 1;
				clearTimeout(loopID);
			}
		};
		loop();
	}
}

//全てのチェックマークを削除
function c3dRemoveCheckMark(){
	var sc = 1;
	var loopID;
	var loop = function(){
		sc += (0.01 - sc)*0.05;
		for(var i=0; i<checkArray.length; i++){
			checkArray[i].scale.set(sc,sc,1);
		}
		if(sc>0.05){
			loopID = setTimeout(loop,1/60);
		}else{
			for(var i=0; i<checkArray.length; i++){
				checkArray[i].scale.set(0.05,0.05,1);
				boxs.remove(checkArray[i]);
				checkArray[i].geometry.dispose();
				checkArray[i].material.dispose();
				delete checkArray[i];
			}
			checkArray = [];
		}
	};
	loop();
}

//全てのチェック済み物件にチェックマークを付ける（検索状態からdefaultに戻ったとき）
function c3dSetCheckMark_All(){
	var leng = XML_DATA.houseList.length;
	for(var i=0; i<leng; i++){
		if(XML_DATA.houseList[i].check){
			c3dSetCheckMark(XML_DATA.houseList[i].dre);
		}
	}
}





/*-------------animate---------------*/
/*--------------------------------------*/

var circleAnimateOpeningBoxsID = 0;
var c3dSwipAnimateID = 0;
var darkenBoxsID = 0;
var lightenBoxsID = 0;
var StopAndChoiceBoxTimerID = 0;

circle3d_yR1 = 0;
circle3d_yR2 = 0;

function animate(){
	circle3d_yR2 = circle3d_yR1;
	circle3d_yR1 = boxs.rotation.y;
	
	animateID = requestAnimationFrame( animate );
	renderer.render( scene, camera );
	//trackball.update();
}

function setValueC3dR(){
	circle3d_yR2 = circle3d_yR1;
	circle3d_yR1 = boxs.rotation.y;
}


//boxsの回転アニメーションをキャンセル
function cancelBoxsRotation(){
	cancelAnimationFrame(circleAnimateOpeningBoxsID);
	cancelAnimationFrame(c3dSwipAnimateID);
	cancelAnimationFrame(darkenBoxsID);
	clearTimeout(StopAndChoiceBoxTimerID);
}


//3DCircleのオープニング動き：Camera：BOXのZ軸
function circleAnimateOpeningCamera(){
	//position
	var endX = 0;
	var endY = 60;
	var endZ = hankei+400;
	if(Math.abs(boxs.rotation.y) > 0.02){
		camera.position.x += (endX - camera.position.x)*0.03;
		camera.position.y += (endY - camera.position.y)*0.028;
		camera.position.z += (endZ - camera.position.z)*0.034;
		boxs.rotation.z += (0-boxs.rotation.z)*0.018;
	}else{
		camera.position.x += (endX - camera.position.x)*0.1;
		camera.position.y += (endY - camera.position.y)*0.1;
		camera.position.z += (endZ - camera.position.z)*0.1;
		boxs.rotation.z += (0-boxs.rotation.z)*0.05;
	}
		
	nowLookAtZ = hankei*0.77;
	camera.lookAt(new THREE.Vector3(nowLookAtX, nowLookAtY, nowLookAtZ));
	
	if(Math.abs(camera.position.z - endZ) < 0.05){
		camera.position.x = endX;
		camera.position.y = endY;
		camera.position.z = endZ;
		boxs.rotation.z = 0;
		SITE_NAVI.showNavi();
		cancelAnimationFrame(circleAnimateOpeningCameraID);
	}else{
		circleAnimateOpeningCameraID = requestAnimationFrame( circleAnimateOpeningCamera );
	}
}


//3DCircleのオープニング動き：Boxs：Y軸のみ
function circleAnimateOpeningBoxs(){
	//position
	var moveFixFlag = false;
	if(Math.abs(boxs.rotation.y) > 0.02){
		boxs.rotation.y += (0-boxs.rotation.y)*0.02;
	}else{
		if(!moveFixFlag){
			c3dMouseActLockFlag = false;
			moveFixFlag = circleKaitenFix();
		}
	}
	
	if(moveFixFlag){
		cancelAnimationFrame(circleAnimateOpeningBoxsID);
	}else{
		circleAnimateOpeningBoxsID = requestAnimationFrame( circleAnimateOpeningBoxs );
	}
}


//Circleスワイプ余韻アニメーション
function c3dSwipAnimate(){
	//console.log("Circleスワイプ余韻アニメーション");
	var moveFixFlag = false;
	if(Math.abs(c3dSwipEndMoveR) > 0.003){
		boxs.rotation.y += c3dSwipEndMoveR;
		c3dSwipEndMoveR *= 0.98;
	}else{
		moveFixFlag = circleKaitenFix();
	}
	
	if(moveFixFlag){
		//!SORT_VERTICAL.openFlag && !c3dMouseActLockFlag
		//console.log(SORT_VERTICAL.openFlag);
		//console.log(c3dMouseActLockFlag);
		c3dSwipEndMoveR = 0;
		cancelAnimationFrame(c3dSwipAnimateID);
	}else{
		c3dSwipAnimateID = requestAnimationFrame(c3dSwipAnimate);
	}
	//renderer.render( scene, camera );
}


//回転中のCircleの動きが弱まってきたときに、キュッと止める
//(360/boxArray.length)*(Math.PI/180)*i;
function circleKaitenFix(){
	var diff = circle3d_yR2 - circle3d_yR1;
	var nowKakudo = boxs.rotation.y*180/Math.PI;
	var fixKakudo = 0;
	if(/*Math.abs(diff) < 0.06 && */diff < 0){
		fixKakudo = Math.ceil(nowKakudo/(360/boxArray.length))*(360/boxArray.length);
	}else if(/*Math.abs(diff) < 0.06 && */diff > 0){
		fixKakudo = Math.floor(nowKakudo/(360/boxArray.length))*(360/boxArray.length);
	}else if(/*Math.abs(diff) < 0.06 && */diff == 0){
		fixKakudo = Math.round(nowKakudo/(360/boxArray.length))*(360/boxArray.length);
	}
	boxs.rotation.y += ((fixKakudo*Math.PI/180)-boxs.rotation.y)*0.05;
	
	if(Math.abs((fixKakudo*Math.PI/180)-boxs.rotation.y)<0.001){
		boxs.rotation.y = fixKakudo*Math.PI/180;
		if(!searchRotatFlag) StopAndChoiceBox();
		return true;
		//if(viewDataType != "space"){}
	}else{
		return false;
	}
}



/*-------------Circleが止まったときの一連の動き---------------*/
/*------------------------------------------------------------------*/
var c3dboxColor = 1;
var choiceBoxObj;	//手前に来たBox
var choiceBoxMirrorObj;	//手前に来たBoxのMirror
var choiceHouseData = {};		//手前に来た物件のデータ

//circleが止まったとき
function StopAndChoiceBox(){
	//! 滑动结束
	//console.log("StopAndChoiceBox");
	// StopAndChoiceBoxTimerID = setTimeout(function(){
		/*if(!SORT_VERTICAL.openStandbyFlag) */
		// darkenBoxs();
		if(!SORT_VERTICAL.openFlag) showHouseName();
	// },300);
}

//センター以外のboxを暗く
function darkenBoxs(){
	if(lightenBoxsID>0) cancelAnimationFrame(lightenBoxsID);
	for(var i=0; i<boxArray.length; i++){
		if(Math.abs(boxArray[i].getWorldPosition().x)>0.5 || (Math.abs(boxArray[i].getWorldPosition().x)<=0.5 && boxArray[i].getWorldPosition().z<0)){
			boxArray[i].material.color.setRGB(c3dboxColor,c3dboxColor,c3dboxColor);
		}else{
			boxArray[i].material.color.setRGB(1,1,1);
		}
	}
	if(c3dboxColor>0.3){
		c3dboxColor -= 0.02;
		darkenBoxsID = requestAnimationFrame(darkenBoxs);
	}else{
		c3dboxColor = 0.3;
		cancelAnimationFrame(darkenBoxsID);
	}
	//boxArray[i].material.color.setRGB(0.5,0.5,0.5);		//色は0〜1で指定
}

//物件名を表示
function showHouseName(){
	// SOUND.playHouseNameShow();
	$("#houseName").stop(false, false).fadeIn(300,function(){
		//console.log("物件名を表示fadein後");
		setClickEventChoiceBox();
		c3dMouseActLockFlag = false;
	});
	for(var i=0; i<boxArray.length; i++){
		if(Math.abs(boxArray[i].getWorldPosition().x)<=0.5 && boxArray[i].getWorldPosition().z>0){
			choiceBoxObj = boxArray[i];
			console.log("最后的选择choiceBoxObj------>")
			console.log(choiceBoxObj)
			$("#houseName div").text(choiceBoxObj.title)
			choiceBoxMirrorObj = boxArrayMirror[i];
			//console.log("物件名を表示-選ばれた物件を確認");
			break;
		}
	}
	if(viewDataType != "space") choiceHouseData = XML_DATA.getHouseData(choiceBoxObj.name);
	if(viewDataType == "space"){
		//choiceHouseData
		//searchHouseData : 検索後のデータ
		for(var i=0; i<searchHouseData.length; i++){
			if(choiceBoxObj.name == searchHouseData[i].thumbnail){
				choiceHouseData = searchHouseData[i];
				break;
			}
		}
	}
	$("#houseName h2 span").text(choiceHouseData.name);
	$("#houseName .year").text(choiceHouseData.year);
	if(choiceHouseData.new){
		$("#houseName h2 img").css("display","inline");
	}else{
		$("#houseName h2 img").css("display","none");
	}
}

//circleがスワイプされて選択状態解除時
function clearChoiceBox(){
	lightenBoxs();
	$("#houseName").stop(false, false).fadeOut(100);
}

//全てのboxを明るく
function lightenBoxs(){
	if(darkenBoxsID>0) cancelAnimationFrame(darkenBoxsID);
	for(var i=0; i<boxArray.length; i++){
		if(boxArray[i] != choiceBoxObj){
			boxArray[i].material.color.setRGB(c3dboxColor,c3dboxColor,c3dboxColor);
		}
	}
	if(c3dboxColor<1.0){
		c3dboxColor += 0.1;
		lightenBoxsID = requestAnimationFrame(lightenBoxs);
	}else{
		c3dboxColor = 1.0;
		cancelAnimationFrame(lightenBoxsID);
	}
	//boxArray[i].material.color.setRGB(0.5,0.5,0.5);		//色は0〜1で指定
}

//選択されたBOXにClick Eventを設定
var setClickEventChoiceBox_firstFlag = true;
function setClickEventChoiceBox(){
	
	//SORT_VERTICAL.openStandbyFlag = true;
	
	//PCの場合は、センターの物件サムネにマーオスオーバーでカーソルを変える
	if(setClickEventChoiceBox_firstFlag){
		setClickEventChoiceBox_firstFlag = false;
		if(device=="pc"){
			var clickablePnt = {};
			
			$("#circle3d").mousemove(function(ev){
				/*
				clickablePnt = getScreenPoint(choiceBoxObj);
				if(ev.clientX > clickablePnt.x && ev.clientY > clickablePnt.y && ev.clientX < clickablePnt.x+clickablePnt.size && ev.clientY < clickablePnt.y+clickablePnt.size){
					$(this).css("cursor","pointer");
				}else if(checkHitBox(ev)){
					$("#"+targetElem).css({"cursor":"grab","cursor":"-moz-grab","cursor":"-webkit-grab"});
				}else{
					$(this).css("cursor","default");
				}
				*/
				if(checkHitBox(ev,"move",choiceBoxObj)){
					$(this).css("cursor","pointer");
				}else if(checkHitBox(ev,"move",0)){
					//$("#"+targetElem).css({"cursor":"grab","cursor":"-moz-grab","cursor":"-webkit-grab"});
					$("#"+targetElem).css({"cursor":'url(images/icon_hand_yoko.cur),url(images/icon_hand_yoko.png),move'});
				}else{
					$(this).css("cursor","default");
				}
			});
		}
	
		$("#"+targetElem).on(onEnd, function(ev){
			if (ev.target == renderer.domElement){
				//マウス座標2D変換
				/*var boxMouse = {x:0,y:0};
				var rect = ev.target.getBoundingClientRect();
				boxMouse.x = ev.clientX - rect.left;
				boxMouse.y = ev.clientY - rect.top;
				
				//マウス座標3D変換
				boxMouse.x =  (boxMouse.x / stageW) * 2 - 1;
				boxMouse.y = -(boxMouse.y / stageH) * 2 + 1;
				
				// マウスベクトル
				var vector = new THREE.Vector3( boxMouse.x, boxMouse.y ,1);
				
				// vector はスクリーン座標系なので, オブジェクトの座標系に変換
				vector.unproject(camera);
				
				// 始点, 向きベクトルを渡してレイを作成
				var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
				
				// レイとBOXの交差判定
				var objs = ray.intersectObjects( boxArray );*/
				
				// 交差していた場合の処理
				if (checkHitBox(ev,"end",choiceBoxObj) && Math.abs(c3dSwipEndMoveR)<0.001 && $("#houseName").css("opacity")>=1 && $("#houseName").css("display")=="block"){
					c3dMouseActLockFlag = true;
					if(viewDataType=="space"/* && SORT_VERTICAL.openStandbyFlag*/){
						for(var i=0; i<searchHouseData.length; i++){
							if(choiceBoxObj.name==searchHouseData[i].thumbnail){
								// SOUND.playThumClick();
								SORT_VERTICAL.openFlag = true;
								VIEW_PHOTO.openView("space",i,searchHouseData);
								break;
							}
						}
					}else{
						// SOUND.playThumClick();
						SORT_VERTICAL.openThumbnail(choiceBoxObj, getScreenPoint(choiceBoxObj));
					}
				}
			}
		});
		
		$("#houseName h2, #houseName .arrow").on(onEnd, function(ev){
			if(/*!c3dMouseDownFlag && */Math.abs(c3dSwipEndMoveR)<0.001){
				c3dMouseActLockFlag = true;
				if(viewDataType=="space"/* && SORT_VERTICAL.openStandbyFlag*/){
					for(var i=0; i<searchHouseData.length; i++){
						if(choiceBoxObj.name==searchHouseData[i].thumbnail){
							// SOUND.playThumClick();
							SORT_VERTICAL.openFlag = true;
							VIEW_PHOTO.openView("space",i,searchHouseData);
							break;
						}
					}
				}else{
					// SOUND.playThumClick();
					SORT_VERTICAL.openThumbnail(choiceBoxObj, getScreenPoint(choiceBoxObj));
				}
			}
		});
	}
}




/*-------------3Dオブジェクトのスクリーン座標を取得---------------*/
/*-----------------------------------------------------------------------*/
function getScreenPoint(obj3D){
	//console.log("obj3D_scale:"+obj3D.scale.z);
	/*var point3d = new THREE.Vector3();
	point3d.copy(obj3D.position);
	var stagePoint = point3d.project(camera);*/
	var worldPnt = obj3D.getWorldPosition();
	var stagePoint = worldPnt.project(camera);
	var pointObj = {};
	pointObj.x = stageW*(stagePoint.x+1)/2;		//project()で返される値：x:左端が-1、右端が1
	pointObj.y = stageH*(-stagePoint.y+1)/2;	//project()で返される値：y:上端が1、下端が-1
	
	//boxサイズのスクリーンでのサイズ
	var boxLeftTopPnt = new THREE.Vector3();
	boxLeftTopPnt.copy(worldPnt);
	boxLeftTopPnt.x = worldPnt.x - boxSize/2;
	boxLeftTopPnt.y = worldPnt.y + boxSize/2;
	
	var boxRightTopPnt = new THREE.Vector3();
	boxRightTopPnt.copy(worldPnt);
	boxRightTopPnt.x = worldPnt.x + boxSize/2;
	boxRightTopPnt.y = worldPnt.y + boxSize/2;

	var stageBoxLTPnt = boxLeftTopPnt.project(camera);
	var stageBoxRTPnt = boxRightTopPnt.project(camera);
	
	//pointObj.size = stageBoxRTPnt.x - stageBoxLTPnt.x;
	pointObj.size = (stageW*(stageBoxRTPnt.x+1)/2) - (stageW*(stageBoxLTPnt.x+1)/2);
	pointObj.size = stageH*0.22;		//調整
	pointObj.x -= pointObj.size/2;
	pointObj.y -= pointObj.size/2;
	
	return pointObj;
}


/*-------------------*/


//センターサムネを隠す
function hideChoicedThumbnail(){
	choiceBoxObj.material.opacity = 1;
	choiceBoxMirrorObj.material.opacity = 1;
}


//センターサムネを表示
var showChoicedThumbnailID = 0;
function showChoicedThumbnail(){
	var opa = choiceBoxObj.material.opacity;
	opa += 0.04;
	choiceBoxObj.material.opacity = opa;
	choiceBoxMirrorObj.material.opacity = opa;
	if(opa<1){
		showChoicedThumbnailID = requestAnimationFrame(showChoicedThumbnail);
	}else{
		c3dMouseActLockFlag = false;
		choiceBoxObj.material.opacity = 1;
		choiceBoxMirrorObj.material.opacity = 1;
		cancelAnimationFrame(showChoicedThumbnailID);
	}
}






/*---------------------------------------------------------------------------*/
/*----------------------------検索後の動き-------------------------------*/
/*---------------------------------------------------------------------------*/
var viewDataType = "dre";		//dre, space, year
var viewDataType_prev = "dre";	//検索前のデータタイプ
var searchRotatFlag = false;	//検索回転中かどうか

function c3dAfterSearch(searchData){
	searchRotatFlag = true;
	clearChoiceBox();
	//SORT_VERTICAL.openStandbyFlag = false;
	SORT_VERTICAL.openFlag = false;
	if(searchData.type=="dre" && viewDataType=="dre"){
		c3dAfterSearchHouseName(searchData);
	}else{
		SITE_NAVI.hideNavi();
		c3dRemoveCheckMark();
		c3dAfterSearchMove(searchData);
	}
	viewDataType_prev = viewDataType;
	viewDataType = searchData.type;
}

// 物件名で検索した場合（検索前も物件名表示の場合）
function c3dAfterSearchHouseName(searchData){
	c3dMouseActLockFlag = false;
	var na = searchData.data;
	var target = scene.getObjectByName(na);
	var targetDeg = -Math.atan2(target.position.x,target.position.z)*180/Math.PI;
	var nowDeg = boxs.rotation.y*180/Math.PI;
	
	var moveFixFlag = false;
	var loopID;
	var moveCircle = function(){
		if(Math.abs(targetDeg - nowDeg)>0.01){
			nowDeg += (targetDeg - nowDeg)*0.05;
			boxs.rotation.y = nowDeg*Math.PI/180;
		}else{
			searchRotatFlag = false;
			moveFixFlag = circleKaitenFix();
		}
		if(moveFixFlag){
			cancelAnimationFrame(loopID);
			SITE_NAVI.showNavi();
		}else{
			loopID = requestAnimationFrame(moveCircle);
		}
	};
	moveCircle();
}

//検索後のサークル視点移動
function c3dAfterSearchMove(searchData){
	
	c3dMouseActLockFlag = true;
	showPleaseWait();
	var loopID;
	
	var endHankei = hankei*(Math.random()*2+1);
	var nowHankei = hankei+400;
	var staHankei = nowHankei;
	
	var endDegYX = Math.random()*180 - 90 + 90;
	//var endDegXZ = Math.random()*180 + 90;
	var endDegXZ = Math.random()*360;
	var endX = Math.cos(endDegYX*Math.PI/180)*endHankei;
	var endY = Math.sin(endDegYX*Math.PI/180)*endHankei;
	var endZ = Math.cos(endDegXZ*Math.PI/180)*endHankei;
	var staX = camera.position.x;
	var staY = camera.position.y;
	var staZ = camera.position.z;
	cnt = 0;
	
	var spd = 0.06;
	var moveCamera = function(){
		camera.position.x = Math.easeInOutCubic(cnt, staX, endX-staX, 1);
		camera.position.y = Math.easeInOutCubic(cnt, staY, endY-staY, 1);
		camera.position.z = Math.easeInOutCubic(cnt, staZ, endZ-staZ, 1);
		cnt += 1/(60*1.5);
		nowLookAtZ *= 0.9;
		camera.lookAt(new THREE.Vector3(nowLookAtX, nowLookAtY, nowLookAtZ));

		if(cnt<=1){
			loopID = requestAnimationFrame(moveCamera);
		}else{
			hikakuDataNum(searchData);
			cancelAnimationFrame(loopID);
		}
	};
	moveCamera();
}

//検索データと現在の閲覧データを比較
function hikakuDataNum(searchData){
	var nowLeng = boxArray.length;
	var nextLeng = 0;
	var diff = 0;		//nowLengとnextLengの差
	if(searchData.type=="year"){
		var years = {min:0, max:0};
		years.min = searchData.data.split("-")[0]*1;
		years.max = searchData.data.split("-")[1]*1;
		for(var i=0; i<XML_DATA.houseList.length; i++){
			if(XML_DATA.houseList[i].year>=years.min && XML_DATA.houseList[i].year<=years.max){
				nextLeng++;
			}
		}
	}else if(searchData.type=="space"){
		for(var i=0; i<XML_DATA.houseList.length; i++){
			var photosList = XML_DATA.houseList[i].photos;
			for(var j=0; j<photosList.length; j++){
				if(photosList[j].space.indexOf(searchData.data)>=0){
					nextLeng++;
				}
			}
		}
	}else if(searchData.type=="dre"){
		nextLeng = XML_DATA.houseList.length;
	}
	
	diff = nextLeng - nowLeng;
	
	if(nowLeng>nextLeng){
		//次の表示件数のほうが少ない場合
		c3dMinusDataMove(searchData, nowLeng, nextLeng);
	}else if(nowLeng<nextLeng){
		//次の表示件数のほうが多い場合
		c3dPlusDataMove(searchData, nowLeng, nextLeng);
	}else if(nowLeng==nextLeng){
		c3dSearchRotation_loadingAnima(searchData);
	}
}

//閲覧数を減らす
function c3dMinusDataMove(searchData, nowLeng, nextLeng){
	var leng = nowLeng - nextLeng;
	var cnt = 0;
	var tm = Math.min(1000/leng, 300);
	var timerID;
	var timer = function(){
		timerID = setTimeout(function(){
			c3dDeleteDataMove(boxArray.pop(), boxArrayMirror.pop());
			cnt++;
			if(cnt<leng){
				timer();
			}else{
				clearTimeout(timerID);
				setTimeout(function(){
					c3dSmallerMove(searchData, nextLeng);
					//c3dSetSearchData(searchData);
				},300);
			}
		},tm);
	};
	//timer();
	timer();

}

//閲覧数を増やす
var c3dPlusStanbyFlag = false;
function c3dPlusDataMove(searchData, nowLeng, nextLeng){
	c3dPlusStanbyFlag = false;		//サークルを拡大し終わるとtrue
	var leng = nextLeng - nowLeng;
	var cnt = 0;
	var tm = Math.min(1000/leng, 300);
	var timerID;
	var boxsLeng = boxArray.length;
	
	c3dbiggerMove(searchData, nextLeng);
	
	var timer = function(){
		timerID = setTimeout(function(){
			if(c3dPlusStanbyFlag){
				c3dAddDataMove(nextLeng, boxsLeng+cnt, searchData);
				cnt++;
			}
			if(cnt<leng){
				timer();
			}else{
				clearTimeout(timerID);
			}
		},tm);
	};
	timer();
}

//サムネを上昇させて削除
function c3dDeleteDataMove(target, targetMirror){
	var sp = 1;
	var loopID;
	var loopMove = function(){
		target.position.y += sp;
		sp*=1.25;
		targetMirror.material.opacity -= 0.05;
		if(targetMirror.material.opacity<=0){
			boxs.remove(targetMirror);
			targetMirror.geometry.dispose();
			targetMirror.material.dispose();
			delete targetMirror;
		}
		
		if(target.position.y < 5000){
			loopID = requestAnimationFrame(loopMove);
		}else{
			cancelAnimationFrame(loopID);
			boxs.remove(target);
			target.geometry.dispose();
			target.material.dispose();
			delete target;
		}
	}
	loopMove();
}

//サムネを下降させて追加
function c3dAddDataMove(nextLeng, num, searchData){
	var imgPath;
	var pathListLeng;
	if(viewDataType_prev == "space"){
		pathListLeng = thumImgPathList.length;
		imgPath = thumImgPathList[Math.floor(Math.random()*pathListLeng-0.001)];
	}else{
		pathListLeng = baseThumImgPathList.length;
		imgPath = baseThumImgPathList[Math.floor(Math.random()*pathListLeng-0.001)];
	}
	
	var texloader = new THREE.TextureLoader();	//マッピングテクスチャ
	var tex =texloader.load(imgPath);
	
	var geometry = new THREE.PlaneGeometry(boxSize, boxSize, 0);	//幅, 高さ, 奥行き
	var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map:tex, transparent:true, opacity:1 });	//色
	material.side = THREE.DoubleSide;
	boxArray.push(new THREE.Mesh(geometry, material));
	var target = boxArray[num];
	boxs.add(target);
	var radian = (360/nextLeng)*(Math.PI/180)*num;
	var x = Math.sin(radian)*hankei;
	var y = 5000;
	var z = Math.cos(radian)*hankei;
	target.position.set(x,y,z);
	target.rotation.set(0,radian,0);
	//boxArray[i].name = XML_DATA.houseList[i].dre;
	
	//映り込み
	var geometryM = new THREE.PlaneGeometry(boxSize, boxSize, 0);	//幅, 高さ, 奥行き
	var materialM = new THREE.MeshBasicMaterial({ color: 0x333333, map:tex, transparent:true, opacity:0 });	//色
	materialM.side = THREE.DoubleSide;
	boxArrayMirror.push(new THREE.Mesh(geometryM, materialM));
	var targetM = boxArrayMirror[num];
	boxs.add(targetM);
	var y2 = 0-boxSize;
	targetM.position.set(x,y2,z);
	targetM.scale.y = boxArrayMirror[num].scale.y*(-1);
	targetM.rotation.set(0,radian,0);
	//boxArrayMirror[i].name = XML_DATA.houseList[i].dre+"_M";
	
	//動き
	var loopID;
	var loop = function(){
		y += (0 - y)*0.1;
		if(y>0.1){
			target.position.y = y;
		}else{
			target.position.y = 0;
		}
		if(target.position.y <= 0.5){
			if(targetM.material.opacity < 1){
				targetM.material.opacity += 0.1;
				loopID = requestAnimationFrame(loop);
			}else{
				targetM.material.opacity = 1;
				cancelAnimationFrame(loopID);
				if(nextLeng-1<=num) c3dSearchRotation_loadingAnima(searchData);
			}
		}else{
			loopID = requestAnimationFrame(loop);
		}
	};
	loop();
	
	
}

//サークルを小さくする
var c3dSizeMoveOneCnt = 0;
function c3dSmallerMove(searchData, nextLeng){
	var hankeiNext = ((boxSize*boxArray.length)*1.1)/Math.PI/2;
	for(var i=0; i<boxArray.length; i++){
		var degNext = (360/boxArray.length)*i;
		c3dSizeMoveOneCnt = 0;
		c3dSizerMoveOne(boxArray[i],boxArrayMirror[i],hankeiNext,degNext);
	}
	c3dSearchRotation_loadingAnima(searchData);
}

//サークルを大きくする
function c3dbiggerMove(searchData, nextLeng){
	var hankeiNext = ((boxSize*nextLeng)*1.1)/Math.PI/2;
	for(var i=0; i<boxArray.length; i++){
		var degNext = (360/nextLeng)*i;
		c3dSizeMoveOneCnt = 0;
		c3dSizerMoveOne(boxArray[i],boxArrayMirror[i],hankeiNext,degNext);
	}
	//c3dSearchRotation_loadingAnima(searchData);
}

function c3dSizerMoveOne(target,targetM,hankeiNext,degNext){
	var biggerFlag = false;
	if(hankeiNext>hankei) biggerFlag = true;
	var sp = 0.03;
	var loopID;
	var deg = Math.atan2(target.position.x, target.position.z)*180/Math.PI;
	
	if(degNext-deg>180) deg += 360;
	if(degNext-deg<-180) deg -= 360;
	
	var degStart = deg;
	var hankeiStart = hankei;
	

	
	var cnt = 0;
	var loop = function(){
		hankei = Math.easeInOutCubic(cnt, hankeiStart, hankeiNext-hankeiStart, 1);
		deg = Math.easeInOutCubic(cnt, degStart, degNext-degStart, 1);
		cnt += 1/60;
		var rad = deg*Math.PI/180;
		var x = Math.sin(rad)*hankei;
		var y = 0;
		var z = Math.cos(rad)*hankei;
		target.position.set(x,y,z);
		target.rotation.set(0,rad,0);
		targetM.position.set(x,y-boxSize,z);
		targetM.rotation.set(0,rad,0);
		if(Math.abs(hankeiNext-hankei)>0.05 || Math.abs(degNext-deg)>0.05){
			loopID = requestAnimationFrame(loop);
		}else{
			x = Math.sin(degNext*Math.PI/180)*hankeiNext;
			y = 0;
			z = Math.cos(degNext*Math.PI/180)*hankeiNext;
			target.position.set(x,y,z);
			target.rotation.set(0,degNext*Math.PI/180,0);
			targetM.position.set(x,y-boxSize,z);
			targetM.rotation.set(0,degNext*Math.PI/180,0);
			
			c3dSizerCameraMove();
			
			c3dSizeMoveOneCnt++;
			cancelAnimationFrame(loopID);
			if(c3dSizeMoveOneCnt>=boxArray.length && biggerFlag) c3dPlusStanbyFlag = true;
		}
	};
	loop();
}

//サークルの大きさに合わせてカメラの距離を移動
function c3dSizerCameraMove(){
	var camStartX = camera.position.x;
	var camStartY = camera.position.y;
	var camStartZ = camera.position.z;
	var radYX = Math.atan2(camStartY, camStartX);
	var radZX = Math.atan2(camStartZ,camStartX);
	
	var camHankeiXY = Math.sqrt(Math.pow(camStartX,2)+Math.pow(camStartY,2));
	var camHankeiXYZ = Math.sqrt(Math.pow(camHankeiXY,2)+Math.pow(camStartZ,2));	//２点間の距離（半径）
	
	var myHankei = hankei*1.7;
	//var camEndX = -Math.cos(radYX)*Math.cos(radZX)*myHankei;
	//var camEndY = Math.sin(radYX)*myHankei;
	//var camEndZ = Math.cos(radYX)*Math.sin(radZX)*myHankei;
	var camEndX = Math.cos(radYX)*myHankei;
	var camEndY = Math.sin(radYX)*myHankei;
	var camEndZ = Math.cos(radZX)*myHankei;
	
	var cnt = 0;
	
	var loop = function(){
		camera.position.x = Math.easeInOutCubic(cnt, camStartX, camEndX-camStartX, 1);
		camera.position.y = Math.easeInOutCubic(cnt, camStartY, camEndY-camStartY, 1);
		camera.position.z = Math.easeInOutCubic(cnt, camStartZ, camEndZ-camStartZ, 1);
		cnt += 1/60;
		
		camera.lookAt(new THREE.Vector3(nowLookAtX, nowLookAtY, nowLookAtZ));
		
		if(cnt<=1){
			loopID = requestAnimationFrame(loop);
		}else{
			cancelAnimationFrame(loopID);
		}
	};
	loop();
}



//検索データを取得 - 画像先読み - サークルを回転してnowloading表示
var searchHouseData = [];
function c3dSearchRotation_loadingAnima(searchData){
	searchHouseData = [];
	thumImgPathList = [];
	var nextMoveFlag = false;
	if(searchData.type=="year"){
		searchHouseData = XML_DATA.getYearSearchData(searchData.data);
		for(var i=0; i<searchHouseData.length; i++){
			var imgPath = "images/"+searchHouseData[i].dre+"/"+searchHouseData[i].photos[0].thumbnail;
			thumImgPathList.push(imgPath);
		}
	}else if(searchData.type=="space"){
		searchHouseData = XML_DATA.getSpaceSearchData(searchData.data);
		console.log(searchHouseData);
		for(var i=0; i<searchHouseData.length; i++){
			var imgPath = "images/"+searchHouseData[i].dre+"/"+searchHouseData[i].thumbnail;
			thumImgPathList.push(imgPath);
		}
	}else if(searchData.type=="dre"){
		searchHouseData = XML_DATA.houseList;
		thumImgPathList = XML_DATA.getHouseSImgURL();
	}
	IMG_PRELOAD.loadHouseSImg(thumImgPathList);
	
	var plusDeg = 0.1;
	var cnt = 0;
	var loopID;
	var loop = function(){
		cnt ++;
		if(IMG_PRELOAD.fixFlag && cnt>60){
			if(plusDeg<0.1 && cnt>120){
				hidePleaseWait();
				if(searchData.type=="space" || searchData.type=="year") c3dReturnBasePosition(searchData);
				if(searchData.type=="dre") c3dReturnBasePosition_forDre(searchData);
				cancelAnimationFrame(loopID);
			}else{
				plusDeg*=0.95;
				loopID = requestAnimationFrame(loop);
			}
		}else{
			if(plusDeg<6) plusDeg*=1.005;
			loopID = requestAnimationFrame(loop);
		}
		boxs.rotation.y += plusDeg;
		
		if(!nextMoveFlag && IMG_PRELOAD.fixFlag && loop2FixFlag){
			c3dSetSearchData(searchData);
			nextMoveFlag = true;
		}
		
	}
	loop();
	

	
	var loop2ID;
	var loop2Cnt = 0;
	var loop2_t = Math.min(2000/boxArray.length,200);
	var loop2FixFlag = true;
	var loop2 = function(){
		var num = loop2Cnt%3+1
		var imgPath = "images/loading"+num+".jpg";
		var texloader = new THREE.TextureLoader();	//マッピングテクスチャ
		var tex =texloader.load(imgPath);
		boxArray[loop2Cnt].material.map = tex;
		boxArrayMirror[loop2Cnt].material.map = tex;
		loop2Cnt++;
		if(loop2Cnt<boxArray.length-1){
			loop2ID = setTimeout(loop2,1/60);
		}else{
			loop2FixFlag = true;
			clearTimeout(loop2ID);
		}
		
	};
	//loop2();
};

//検索データをサークルにセット
function c3dSetSearchData(searchData){
	var loopID;
	var loopCnt = 0;
	var tm = Math.min(1000/searchHouseData.length,200);
	var loop = function(cnt,tex){
		loopID = setTimeout(function(){
			boxArray[cnt].material.map = tex;
			boxArrayMirror[cnt].material.map = tex;
		},cnt*tm);
	}
	if(searchData.type=="year" || searchData.type=="dre"){
		for(var i=0; i<searchHouseData.length; i++){
			var imgPath = "images/"+searchHouseData[i].dre+"/"+searchHouseData[i].photos[0].thumbnail;
			var texloader = new THREE.TextureLoader();	//マッピングテクスチャ
			var tex =texloader.load(imgPath);
			
			//boxArray[i].material.map = tex;
			//boxArrayMirror[i].material.map = tex;
			loop(i,tex);
			
			boxArray[i].name = searchHouseData[i].dre;
			boxArrayMirror[i].name = searchHouseData[i].dre+"_M";
		}
	}else if(searchData.type=="space"){
		searchHouseData = XML_DATA.getSpaceSearchData(searchData.data);
		for(var i=0; i<searchHouseData.length; i++){
			var imgPath = "images/"+searchHouseData[i].dre+"/"+searchHouseData[i].thumbnail;
			var texloader = new THREE.TextureLoader();	//マッピングテクスチャ
			var tex =texloader.load(imgPath);
			
			//boxArray[i].material.map = tex;
			//boxArrayMirror[i].material.map = tex;
			loop(i,tex);
			
			boxArray[i].name = searchHouseData[i].thumbnail;
			boxArrayMirror[i].name = searchHouseData[i].thumbnail+"_M";
		}
	}
}

//元の位置に戻る
function c3dReturnBasePosition(searchData){
	var camEndX = 0;
	var camEndY = 60;
	var camEndZ = hankei+400;
	var camStaX = camera.position.x;
	var camStaY = camera.position.y;
	var camStaZ = camera.position.z;
	var boxsEndRota = 0;
	var boxsStaRota = boxs.rotation.y;
	var lookAtZ_Sta = camera.rotation.z;
	var lookAtZ_End = hankei*0.77;
	var cnt = 0;
	var moveFixFlag = false;
	var loopID;
	
	var loop = function(){
		//console.log("元の位置に戻る");
		camera.position.x = Math.easeInOutCubic(cnt, camStaX, camEndX-camStaX, 1);
		camera.position.y = Math.easeInOutCubic(cnt, camStaY, camEndY-camStaY, 1);
		camera.position.z = Math.easeInOutCubic(cnt, camStaZ, camEndZ-camStaZ, 1);
		boxs.rotation.y = Math.easeInOutCubic(cnt, boxsStaRota, boxsEndRota-boxsStaRota, 1);
		nowLookAtZ = Math.easeInOutCubic(cnt, lookAtZ_Sta, lookAtZ_End-lookAtZ_Sta, 1);
		camera.lookAt(new THREE.Vector3(nowLookAtX, nowLookAtY, nowLookAtZ));
		cnt += 1/(60*1.5);
		
		if(cnt>=1){
			if(!moveFixFlag){
				searchRotatFlag = false;
				moveFixFlag = circleKaitenFix();
			}
		}
				
		if(moveFixFlag){
			c3dMouseActLockFlag = false;
			SITE_NAVI.showNavi();
			setAfterSearched_Title(searchData);
			c3dSetCheckMark_All();
			cancelAnimationFrame(loopID);
		}else{
			loopID = requestAnimationFrame( loop );
		}
		
	};
	loop();
}

//元の位置に戻るspace or year から物件名検索
function c3dReturnBasePosition_forDre(searchData){
	var camEndX = 0;
	var camEndY = 60;
	var camEndZ = hankei+400;
	var camStaX = camera.position.x;
	var camStaY = camera.position.y;
	var camStaZ = camera.position.z;
	//var boxsEndRota = 0;
	//var boxsStaRota = boxs.rotation.y;
	nowLookAtZ = camera.rotation.z;
	var lookAtZ_Sta = camera.rotation.z;
	var lookAtZ_End = hankei*0.77;
	var cnt = 0;
	var moveFixFlag = false;
	var loopID;
	c3dAfterSearchHouseName(searchData);
	
	var loop = function(){
		//console.log("元の位置に戻るspace or year から物件名検索");
		camera.position.x = Math.easeInOutCubic(cnt, camStaX, camEndX-camStaX, 1);
		camera.position.y = Math.easeInOutCubic(cnt, camStaY, camEndY-camStaY, 1);
		camera.position.z = Math.easeInOutCubic(cnt, camStaZ, camEndZ-camStaZ, 1);
		nowLookAtZ = Math.easeInOutCubic(cnt, lookAtZ_Sta, lookAtZ_End-lookAtZ_Sta, 1);
		camera.lookAt(new THREE.Vector3(nowLookAtX, nowLookAtY, nowLookAtZ));
		cnt += 1/(60*1.5);
		
		if(cnt>=1){
			camera.position.x = camEndX;
			camera.position.y = camEndY;
			camera.position.z = camEndZ;
			nowLookAtZ = lookAtZ_End;
			camera.lookAt(new THREE.Vector3(nowLookAtX, nowLookAtY, nowLookAtZ));
			searchRotatFlag = false;
			c3dMouseActLockFlag = false;
			SITE_NAVI.showNavi();
			c3dSetCheckMark_All();
			cancelAnimationFrame(loopID);
		}else{
			loopID = requestAnimationFrame( loop );
		}
		
	};
	loop();
}



/*---------検索後のタイトル、戻るボタン---------*/
/*---------------------------------------------------*/
function setAfterSearched_Title(searchData){
	if(searchData.type!="dre"){
		$("#searchFix h2").text(searchData.viewtxt);
		$("#searchFix").delay(700).fadeIn(300);
	}
}
$(function(){
	$("#searchFix .return").on(onEnd,function(){
		searchData = {
			data:XML_DATA.houseList[0].dre,
			type:"dre",
			viewtxt:""
		}
		c3dAfterSearch(searchData);
		$("#searchFix").fadeOut(300);
	});
//
});



/*---------Please wait---------*/
/*--------------------------------*/
function showPleaseWait(){
	$("#pleaseWait").css({"opacity":"0","display":"table"}).animate({opacity:1},300);
}
function hidePleaseWait(){
	$("#pleaseWait").stop().fadeOut(300);
}



/*---------サークル回転サウンド---------*/
/*------------------------------------------*/
/*function c3dRotationSound(){
	var loopID;
	var boxDistDeg = 0;
	var circleDeg = 0;
	var circleDeg2 = 0;
	var spd = 2.5;
	var spd2 = 2.5;
	var flag = false;
	var dist = 0;
	var cnt = 0;
	var loop = function(){
		circleDeg = boxs.rotation.y*180/Math.PI;
		boxDistDeg = 360/boxArray.length;
		
		dist = Math.abs(circleDeg2-circleDeg);
		if(dist>180) dist = 360-dist;
		cnt++;
		
		
		if(dist>boxDistDeg && !flag){
			SOUND.playThumRotation();
			flag = true;
		}else if(dist>0 && flag){
			if(dist>10){
				spd = 2.5;
			}else if(dist>5){
				spd = 1.5;
			}else if(dist>1){
				SOUND.stopThumRotation();
			}
			console.log(dist);
			if(spd2 != spd) SOUND.speedThumRotation(spd);
			spd2 = spd;
		}else if(dist==0 && flag){
			SOUND.stopThumRotation();
			flag = false;
		}
		circleDeg2 = circleDeg;
		
		loopID = setTimeout(loop,500);
	};
	loop();
}*/
//c3dRotationSound();



/*---------イージング---------*/
/*------------------------------*/
Math.easeInOutCubic = function (t, b, c, d) {
/*
t : 時間(進行度)0~1
b : 開始の値(開始時の座標やスケールなど)
c : 開始と終了の値の差分
d : Tween(トゥイーン)の合計時間*/
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};




