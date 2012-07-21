$(function(){
	// background.js を読み込む
	var bg = chrome.extension.getBackgroundPage();
	console.log("bg.getColors =" + bg.getColors);
	
	// 現在表示しているタブ情報を取得
	chrome.tabs.getSelected(showColors);
	
	// popup.html に表示するものを記述
	function showColors(tab){
		console.log(tab);
		if(bg.getColors[tab.id] != null){
			console.log("bg.getColors[tab.id] =" + bg.getColors[tab.id]);
			for(var i = 0; i < bg.getColors[tab.id].length; i++){
			
			/*
			$('<div class="colorItem" style="background-color:' + bg.getColors[tab.id][i] + ' / ' + bg.getColors[tab.id][i].toHex() + '">' + bg.getColors[tab.id][i] +'</div>').appendTo("#showColors");
			*/
			
			$('<div class="colorItem" style="background-color:' + bg.getColors[tab.id][i] + '">' + bg.getColors[tab.id][i] + '</div>').appendTo("#showColors");
			
			}
		}else{
		$("#showColors").html('泥棒できる色がありません。</br>残念！');
		}
	}
});