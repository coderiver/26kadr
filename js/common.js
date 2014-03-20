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


// datepicker
var dp = $('.js-dp');
if (dp.length) {
	dp.datepicker({
		numberOfMonths: 2
	});
};

// tooltip
function tooltip () {
	var el = $('.js-ttip'),
			template = $('.js-ttip-template'),
			template_text = template.find('.ttip__text'),
			template_link = template.find('.ttip__load a'),
			template_size = template.find('.ttip__load span');
	el.hover(function(){
		var text = $(this).attr('data-text'),
				link = $(this).attr('data-link'),
				size = $(this).attr('data-size'),
				top = $(this).offset().top,
				left = $(this).offset().left,
				el_height = $(this).height();
		template_text.html(text);
		template_link.attr('href', link);
		template_size.html(size);
		template.show();
		var height = template.height();
		template.css({'top': top - height - el_height + 10, 'left': left});
		template
	}, function(){
		//template.hide();
	});
	template.hover(function(){},function(){
		$(this).hide();
	})
}
tooltip();

});