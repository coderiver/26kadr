$(document).ready(function() {

function nav () {
	var item = $('.step');
	var btn = $('.js-next');
	btn.on('click', function(){
		var el = $(this).attr('href');
		item.removeClass('is-active');
		btn.removeClass('is-active');
		$('#'+el).addClass('is-active');
		$(this).addClass('is-active');
		return false;
	});
}
nav();

});