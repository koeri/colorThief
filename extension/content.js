$(function() {

	var colors = [];

	// 色情報が入っていそうなCSSセレクタ名を配列に格納
	var cssSelecters = [
		'backgroundColor',
		'color',
		//'borderColor',
		'borderTopColor',
		'borderRightColor',
		'borderBottomColor',
		'borderLeftColor',
		'outlineColor',
	];
		
	$('*').each(
		function(){
		
			for(var i = 0; i < cssSelecters.length; i++){
			
				// 指定したCSSセレクタ内に色情報が入ってたら配列colorsにpush
				var c = $(this).css(cssSelecters[i]);
				
				// rgba形式だったらalphaを無視してrgb形式に変換
				c = rgbaCheck(c);
				
				// 配列colorsに同じ色が重複してなかったら、配列colorsにpushで追加
				if( !contains(colors, c) ){
					colors.push(c);
				}
			}
		}
	);
		
	console.log(colors);
	
	// background.js に配列colorsのデータを送信
	// content.js は現在いるタブに対しての操作はできるが、拡張機能にたいしての操作はできない。
	// なので、拡張機能でそのデータを使うために、background.js にデータを送信する必要がある。
	chrome.extension.sendRequest({sendColors: colors}, function(response) {
	
		// レスポンスで何か受け取る場合
		//console.log(response);
		
	});
	
});

// rgbaデータの場合は、Alphaを無視してrgbに変換
var rgbaCheck = function(str){
	var checkStr = str;
	var keywordStr = "rgba";
	
	// 変数checkStr内がrgbaから始まる文字列かどうかをチェック
	if (checkStr.match(keywordStr)) {
		// 文字列 "rgba" を見つけたら、文字列 "rgb" に置換
		checkStr = checkStr.replace("rgba", "rgb");
		// 文字列 ", ***)" を見つけたら、文字列 ")" に置換
		checkStr = checkStr.replace(/, [0-9.]+\)/, ")");
		return checkStr;
	}else{
		return checkStr;
	}
}

// 色情報を溜め込んでいる配列内に 同じ色情報が存在するかを確認
// 同じ色情報が存在したら true, 存在しなかったら false を返す。
var contains = function(array, str){
	for(var i =0; i < array.length; i++){
		if(str == array[i]){
			return true;
		}
	}
	return false;
};
