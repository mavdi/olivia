$(window).ready(function(){
	new Main().init();
});

var Main = function() {
}

Main.prototype = (function(){
	var init = function() {
		console.log("init");
	}

	return {
		init : init
	}
})();
