$(document).ready(function() {

// datepicker
var dp = $('.js-dp');
$.datepicker.regional['ru'] = { 
	closeText: 'Закрыть', 
	prevText: '&#x3c;Пред', 
	nextText: 'След&#x3e;', 
	currentText: 'Сегодня', 
	monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь', 
	'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'], 
	monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн', 
	'Июл','Авг','Сен','Окт','Ноя','Дек'], 
	dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'], 
	dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'], 
	dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'], 
	dateFormat: 'dd.mm.yy', 
	firstDay: 1, 
	isRTL: false 
}; 
$.datepicker.setDefaults($.datepicker.regional['ru']); 
if (dp.length) {
	dp.datepicker({
		numberOfMonths: 2,
		minDate: 1
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