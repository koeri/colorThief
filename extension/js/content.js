$(function() {

	var colors = [];

	// 色情報が入っていそうなCSSセレクタ名を配列に格納
	var cssSelecters = [
		'backgroundColor',
		'color',
		'borderTopColor',
		'borderRightColor',
		'borderBottomColor',
		'borderLeftColor',
		'outlineColor',
	];
	
	// 全ての要素に対して以下の処理を実行
	$('*').each(
		function(){
		
			for(var i = 0; i < cssSelecters.length; i++){
			
				// 指定したCSSセレクタ内に色情報が入ってたら配列colorsにpush
				var c = $(this).css(cssSelecters[i]);
				
				// rgba形式だったらalphaを無視してrgb形式に変換
				// rgba という文字列があったら rgb に置換
				c = replaceTxt(c, "rgba", "rgb");
				
				// 配列colorsに同じ色が重複してなかったら、配列colorsにpushで追加
				if( !checkDuplicate(colors, c) ){
					colors.push(c);
				}
			}
		}
	);
	
	// デバッグ用	
	//console.log(colors);
	
	// background.js に配列colorsのデータを送信
	// content.js は現在いるタブに対しての操作はできるが、拡張機能にたいしての操作はできない。
	// なので、拡張機能でそのデータを使うために、background.js にデータを送信する必要がある。
	chrome.extension.sendRequest({sendColors: colors}, function(response) {
	
		// レスポンスで何か受け取る場合
		//console.log(response);
		
	});
	
});

/** 
 * 指定した文字列が含まれていたら、別の文字列で置換+アルファの処理を実行
 * @param {String} checkStr 検索したい文字列
 * @param {String} keywordStr 検索文字列 
 * @param {String} replaceStr 置換したい文字列
 * @returns {String} 置換+アルファを実行した結果のcheckStrを返す
*/
var replaceTxt = function(checkStr, keywordStr, replaceStr){
	
	// 変数checkStr内がrgbaから始まる文字列かどうかをチェック
	if (checkStr.match(keywordStr)) {
		// 文字列 "rgba" を見つけたら、文字列 "rgb" に置換
		checkStr = checkStr.replace(keywordStr, replaceStr);
		// 文字列 ", ***)" を見つけたら、文字列 ")" に置換
		checkStr = checkStr.replace(/, [0-9.]+\)/, ")");
		return checkStr;
	}else{
		return checkStr;
	}
}

/** 
 * 色情報が入った配列内に、指定した文字列(色情報)と同じ要素があるかを検索
 * @param {Array} array 調査対象の配列
 * @param {String} str 検索文字列
 * @returns {Boolean} 同じ情報が存在したら true, 存在しなかったら false を返す
*/
var checkDuplicate = function(array, str){
	for(var i =0; i < array.length; i++){
		if(str == array[i]){
			return true;
		}
	}
	return false;
};
