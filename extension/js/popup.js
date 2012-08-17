/////////////////////////////////
// # TODO
// - RGB/HEXの設定値を保存できるようにしたい。
// - 色情報一覧を画像を保存できるようにしたい。
// - 色情報一覧をリストで書き出せるようにしたい。
/////////////////////////////////

$(function(){

	// 現在表示しているタブ情報を取得
	// 必ず引数に関数をとる
	chrome.tabs.getSelected(showColors);

});

/////////////////////////////////
// 初期化
/////////////////////////////////
// background.js を読み込む
var bg = chrome.extension.getBackgroundPage();
	
// 色情報をRGB/HEX形式で保存しておくための配列
var cRGB = [];
var cHEX = [];
	
// RGB値を個別に保存しておくための配列
var cR = [];
var cG = [];
var cB = [];
var txtColor = [];

/////////////////////////////////
// popup.html に表示するものを記述
/////////////////////////////////
var showColors = function(tab){
	
	// console.log(tab);
	
	// if文で色情報が取得できているかどうか判別
	// 色情報が取得できていたら
	if(bg.getColors[tab.id] != null){
		//console.log("bg.getColors[tab.id] =" + bg.getColors[tab.id]);
		
		// header部分を表示
		$("#header").css({display:"block"});
		
		// タブを開くごとに色情報を更新するため、古い情報を最初に消去してリセットしておく
		$("#showColors").empty();
		
		// 色情報を読込み＆表示
		for(var i = 0; i < bg.getColors[tab.id].length; i++){
		
			// RGB/HEX形式へそれぞれ変換
			// rgbcolor.js を利用
			var c = new RGBColor(bg.getColors[tab.id][i]);
			cRGB[i] = c.toRGB();
			
			cHEX[i] = c.toHex();
			
			// RGB値を個別に取得
			cR[i] = c.r;
			cG[i] = c.g;
			cB[i] = c.b;
			
			// 色情報を表示するテキスト色を、色情報の輝度によって白/黒に振り分け
			txtColor[i] = checkTxtColor(cR[i], cR[i], cB[i]);
			
			// 指定した形式で色情報を表示
			switch(colorType){
				//RGB形式の場合
				case "RGB":
					$('<div class="colorItem" style="color:' + txtColor[i] + '; background-color:' + cRGB[i] + ';"><div class="colorTxt">' + cRGB[i] + '</div><div class="copied">Copied!</div></div>').appendTo("#showColors");
					break;
				// Hex形式の場合
				case "HEX":
					$('<div class="colorItem" style="color:' + txtColor[i] + '; background-color:' + cHEX[i] + ';"><div class="colorTxt">' + cHEX[i] + '</div><div class="copied">Copied!</div></div>').appendTo("#showColors");
					break;
			}
		}
		
		// 色情報をクリックしたらクリップボードにコピーする
		copyColor();
			
	//色情報が取得できていなかったら
	}else{
		// メッセージを表示
		$("#showColors").html('<div id="failedArea"><h3 id="failedTitle">Failed! - 色泥棒失敗！</h3><p id="failedTxtEng">Please click the icon again, after reload this page.</p><p id="failedTxtJpn">ブラウザを再読込してから、再度アイコンをクリックしてください。</p></div>');
	}
}

/////////////////////////////////
// 表示する色形式(RGB/HEX)をボタンで設定
/////////////////////////////////
var colorType = "RGB"; // 初期設定
var setColorType = function(clickColorType) {
	console.log(clickColorType);
	console.log(colorType);
	colorType = clickColorType;
	chrome.tabs.getSelected(showColors);
}

/////////////////////////////////
// 色情報をクリックしたらクリップボードにコピー＆アニメーション
/////////////////////////////////
var copyColor = function(){
	$(".colorItem").click(
		function () {
			// 色情報テキストをクリップボードにコピー
			var cTxt = $(this).find(".colorTxt").text();
			copyTextToClipboard(cTxt);
			// コピーした色情報テキストの右横に"Copied!"をアニメーション表示する
			$(this).find(".copied").css({display: "block", opacity: "0"});
			//$(this).find(".copied").fadeTo("slow", 1).fadeTo("slow", 0, function(){$(".copied").css({display: "none"});});
			$(this)
				.find(".copied")
				.fadeTo("slow", 1, function(){
					$(this).fadeTo("slow", 0, function(){
						$(this).css({display: "none"});
					})
				});
		}
	);
}

/////////////////////////////////
// テキストをクリップボードにコピー
/////////////////////////////////
// クリップボードへのコピーはテキストフォームでしかできないので
// テキストエリアをフェイクで作ってそこにテキストを格納してコピー
// 参考URL: http://stackoverflow.com/questions/3436102/copy-to-clipboard-in-chrome-extension
var copyTextToClipboard = function(txt){
	var copyArea = $("<textarea/>");
	copyArea.text(txt);
	$("body").append(copyArea);
	copyArea.select();
	document.execCommand("copy");
	copyArea.remove();
}

/////////////////////////////////
// 背景色によってテキスト色を白/黒どちらにするか判別する
/////////////////////////////////
// 参考式: Y=0.3R+0.6G+0.1B で Y>127なら黒、それ以外なら白
// 参考URL: http://q.hatena.ne.jp/1214314649
var checkTxtColor = function(cR,cG,cB){

	// 最高値は255なので、約半分の数値127を堺目にして白/黒の判別する
	var cY = 0.3*cR + 0.6*cG + 0.1*cB;
	
	if(cY > 127){
		return "#111111"; // 黒に設定
	}
	return "#EEEEEE"; // 白に設定
}