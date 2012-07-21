$(function(){
	// background.js を読み込む
	var bg = chrome.extension.getBackgroundPage();
	console.log("bg.getColors =" + bg.getColors);
	
	// 現在表示しているタブ情報を取得
	chrome.tabs.getSelected(showColors);
	
	// 色情報を色んな形式で保存しておくための配列を用意
	var cRGB = [];
	var cHEX = [];

	// popup.html に表示するものを記述
	function showColors(tab){
	
		console.log(tab);
		
		// if文で色情報が取得できているかどうか判別
		// 色情報が取得できていたら
		if(bg.getColors[tab.id] != null){
		
			console.log("bg.getColors[tab.id] =" + bg.getColors[tab.id]);
			
			for(var i = 0; i < bg.getColors[tab.id].length; i++){
			
				// RGB形式,HEX形式へそれぞれ変換
				// rgbcolor.js を利用
				var c = new RGBColor(bg.getColors[tab.id][i]);
				cRGB[i] = c.toRGB();
				cHEX[i] = c.toHex();
				
				var colorType = "HEX";
				
				// 指定した形式で色情報を表示
				switch(colorType){
					case "RGB":
						$('<div class="colorItem" style="background-color:' + cRGB[i] + '">' + cRGB[i] + '</div>').appendTo("#showColors");
						break;
					case "HEX":
						$('<div class="colorItem" style="background-color:' + cHEX[i] + '">' + cHEX[i] + '</div>').appendTo("#showColors");
						break;
				}
			
			}
		//色情報が取得できていなかったら
		}else{
			$("#showColors").html('泥棒できる色がありません。</br>残念！');
		}
	}
});
