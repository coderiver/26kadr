$(document).ready(function() {

function nav () {
	var item = $('.step');
	var btn = $('.js-next');
	btn.on('click', function(){
		var attr = $(this).attr('href');
		item.removeClass('is-active');
		btn.removeClass('is-active');
		$('#'+attr).addClass('is-active');
		$(this).addClass('is-active');
		btn.each(function(){
			var btn_attr = $(this).attr('href');
			if (attr == btn_attr) {
				$(this).addClass('is-active');
			};
		});
		return false;
	});
}
nav();

});