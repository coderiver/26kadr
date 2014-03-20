$(document).ready(function() {

// datepicker
var dp = $('.js-dp');
if (dp.length) {
	dp.datepicker({
		numberOfMonths: 2
	});
};

// tooltip
function tooltip () {
    var hideTimeOut;
	var el = $('.js-ttip'),
			template = $('.js-ttip-template'),
			template_text = template.find('.ttip__text'),
			template_link = template.find('.ttip__load a'),
			template_size = template.find('.ttip__load span');
	el.hover(function(){
        if (hideTimeOut){
            clearTimeout(hideTimeOut);
        }
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
	}, function(){
        hideTimeOut = setTimeout(function(){
            template.hide();
        }, 500);
	});
	template.hover(function(){
        if (hideTimeOut){
            clearTimeout(hideTimeOut);
        }
    },function(){
		$(this).hide();
	})
}
tooltip();

});