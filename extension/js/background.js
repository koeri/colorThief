var getColors = [];

// content.js からデータを受信
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {

		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension"
		);
		
		// content.js から受信した データ sendColors を 変数 getColors に格納
		getColors[sender.tab.id] = request.sendColors;
		console.log("sender.tab.id =" + sender.tab.id);
		
		// content.js にレスポンスを返しておく
		sendResponse(null);
			
	}
);

// BrouserAction アイコンにバッヂを表示
/*
chrome.browserAction.setBadgeText({
	text:"100"
});
*/

// BrowserAction popup.html に表示する内容を設定
// "default_popup": "popup.html" で設定していない html を popup で表示するときに使う
/*
chrome.browserAction.setPopup({
	"popup":"test.html"
});
*/