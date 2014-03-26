ymaps.ready(map_init);

var yandex_map, yandex_map_sp_collection, current_opendays = [], selected_openday = null;

function map_route(struct_deps) {
    yandex_map_sp_collection.removeAll();
    _.each(struct_deps, function (id, i) {
        yandex_map_sp_collection.add(new ymaps.Placemark(_struct_deps[id].center, {}, {
            "iconImageHref": "img/map/sp-" + id + ".png",
            "iconImageSize": [
                45,
                39
            ],
            "iconImageOffset": [
                -20,
                -39
            ],
            "zIndex": 200
        }));
    });
}
function show_popup(selector) {
    $('#js-popup-overlay').show();
    $(selector).show();
}

function hide_popup(selector) {
    $(selector).hide();
    $('#js-popup-overlay').hide();
}

function init_calendar() {
    if ($('#js-dp').length) {

        $('#js-dp').datepicker('destroy');

        $('#js-dp').datepicker({
            numberOfMonths: 2,
            minDate: 1,
            beforeShowDay: opendays_available,
            onSelect: function () {
                on_select_openday($(this).val());
            }
        });
    }
}

function on_select_openday(date) {
    $('#js-field-opendays').val(date);
    $('#js-hidden-opendays').val(date);
    selected_openday = date;
}

function opendays_available(date) {
    if (current_opendays.length == 0) {
        return [false];
    }
    var dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

    if ($.inArray(dmy, current_opendays) != -1) {
        return [true, 'ui-state-openday', 'Открытый день'];
    } else {
        return [false];
    }
}


$(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-Token': $('meta[name=csrf-token]').attr('content')
        }
    });
    $('.js-popup-close').on('click', function () {
        $(this).parents('.popup').hide();
        $(this).parents('.popup__in').hide();
        return false;
    });

    $('#step_7').delegate('#js-open-opendays', 'click', function () {
        init_calendar();
        show_popup('#js-calendar-popup');
        return false;
    });

    $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        prevText: '&#x3c; Пред',
        nextText: 'След &#x3e;',
        currentText: 'Сегодня',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);

    var last_cloud_rnd = 0;
    var rotate_cloud_quote = function () {

        var rnd = random_cloud_quote();
        while (last_cloud_rnd == rnd) {
            rnd = random_cloud_quote();
        }
        last_cloud_rnd = rnd;

        $('.cloud__text', '#js-cloud').fadeOut(function () {
            $(this).text(_cloud_quotes[rnd]).fadeIn();
        });
    };
    var random_cloud_quote = function () {
        return Math.floor(Math.random() * _cloud_quotes.length);
    };

    setInterval(function(){
        rotate_cloud_quote();
    }, 5000);

    app.run('#/');

    init_tooltip();
});

function map_init() {
    yandex_map = new ymaps.Map('map-container', {
        center: [55.753676, 37.619899],
        zoom: 11,
        behaviors: ['default', 'scrollZoom']
    });
    yandex_map_sp_collection = new ymaps.GeoObjectCollection();


    yandex_map.controls.add('zoomControl', { top: 50, right: 10 });
    yandex_map.geoObjects.add(yandex_map_sp_collection);

//    var mapTools = new ymaps.control.MapTools({ items: ["drag", "magnifier"]});
//    yandex_map.controls.add(mapTools);
}

function wordwrap(str, width, brk, cut) {
    width = width || 75;
    cut = cut || false;

    if (!str) {
        return str;
    }

    var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');

    var ret = str.match(RegExp(regex, 'g'));

    if (brk) {
        ret = ret.join(brk);
    }

    return ret;
}

// tooltip
function init_tooltip() {
    var hideTimeOut;
    var el = $('.js-ttip'),
        template = $('.js-ttip-template'),
        template_text = template.find('.ttip__text'),
        template_link = template.find('.ttip__load a'),
        template_size = template.find('.ttip__load span');
    el.on({
        mouseenter: function () {
            if (hideTimeOut) {
                clearTimeout(hideTimeOut);
            }
            var top = $(this).offset().top,
                left = $(this).offset().left,
                el_height = $(this).height();

            template_text.html($(this).attr('data-text'));

            if ($(this).attr('data-size')) {
                template_link.attr('href', $(this).attr('data-link')).show();
                template_size.html($(this).attr('data-size')).show();
            } else {
                template_link.hide();
                template_size.hide();
            }
            template.show();

            var height = template.height();
            template.css({'top': (top - height) - 25, 'left': left});
        },
        mouseleave: function () {
            hideTimeOut = setTimeout(function () {
                template.hide();
            }, 300);
        }
    });

    template.on({
        mouseenter: function () {
            if (hideTimeOut) {
                clearTimeout(hideTimeOut);
            }
        },
        mouseleave: function () {
            $(this).hide();
        }
    });
}

var app = $.sammy(function () {
    var _this = this;
    var user_choose = {
        'who': null,
        '_class': null,
        'directions': [],
        'speciality': null,
        'sp': null
    }, step_to_user_choose_mapper = {
        1: 'who',
        2: '_class',
        3: 'directions',
        4: 'speciality',
        5: 'sp',
        6: 'sp'
    };

    var step7form = null;

    // if from speciality page
    var COOKIE_SPECIALITY = 'spec';
    var from_speciality_page = false;

    if (!_.isUndefined($.cookie(COOKIE_SPECIALITY))) {
        user_choose.speciality = parseInt($.cookie(COOKIE_SPECIALITY));
        if (!isNaN(user_choose.speciality)) {
            user_choose.directions = [1]; // fake!
            $.removeCookie(COOKIE_SPECIALITY);
            from_speciality_page = true;
        }
    }
    //

    var clear_next_steps = function (step) {
        if (from_speciality_page) {
            return false;
        }
        for (var i = (step + 1); i <= 5; i++) {
            var choose_name = step_to_user_choose_mapper[i];
            if (_.isArray(user_choose[choose_name])) {
                user_choose[choose_name] = [];
            } else {
                user_choose[choose_name] = null;
            }
        }
    };

    var build_tooltip = function (tooltip) {
        var ret = ' data-text="' + tooltip.text + '"';
        if (!_.isUndefined(tooltip.ext_size)) {
            ret += ' data-link="/static/priem/pdf/' + tooltip.link + '.pdf" data-size="' + tooltip.ext_size + '"';
        }
        return ret;
    };

    window.user_choose = user_choose;

    //var _classes = [9, 10, 11];

    var step_handlers = {};
    // step 1
    window.choose_who = function (who) {
        user_choose.who = who;
        clear_next_steps(1);
    };


    // ***** step 2 *****
    window.choose_class = function (_class) {
        user_choose._class = _class;
        clear_next_steps(2);
    };
    step_handlers.step2 = function () {
        init_choose_class();

        var $radio = $('#form-choose-class input:radio:checked');
        if ($radio.length) {
            if ($radio.val() != user_choose._class) {
                $radio.attr('checked', false);
            }
        }
    };
    var init_choose_class = function () {
        $('#form-choose-class input[type="radio"]').on('click', function () {
            user_choose._class = $(this).val();
            clear_next_steps(2);
        });
    };


    // **** step 3 ****
    var init_choose_directions = function () {
        $('#form-choose-directions input[type=checkbox]').on('click', function () {

            if (this.checked && user_choose.directions.length == 3) {
                alert('Можно выбрать только до 3-х направлений.');
                this.checked = false;
            }

            if (this.checked) {
                user_choose.directions.push($(this).val());
            } else {
                user_choose.directions = _.without(user_choose.directions, $(this).val());
            }

            user_choose.directions = _.uniq(user_choose.directions);
            clear_next_steps(3);
        });

        _.each(user_choose.directions, function (id) {
            var $checkbox = $('#form-choose-directions input[type=checkbox][value=' + id + ']');

            if ($checkbox.length) {
                $checkbox.attr('checked', true);
            } else {
                delete user_choose.directions[id];
            }
        });

        var $checkbox = $('#form-choose-directions input[type=checkbox]');
        if ($checkbox.length == 1){
            $checkbox.trigger('click');
        }
    };
    step_handlers.step3 = function () {
        var directions = _data.class_to_directions[user_choose.who][user_choose._class];
        var $container = $('#form-choose-directions');

        $container.empty();
        var html = '<div class="step__form-column">';
        _.each(directions, function (id, i) {
            i++;
            var title = wordwrap(_directions[id], 22);
            if (title.length > 1) {
                title = title.join('</span><i></i></span><span class="choicer__bg"><span>');
            } else {
                title = title.pop();
            }

            var item_class = 'choicer__text';
            var item_tooltip = '';
            if (_directions_tooltips[id]) {
                item_class += ' js-ttip';
                _directions_tooltips[id].link = 'd' + id;
                item_tooltip = build_tooltip(_directions_tooltips[id])
            }

            html += '<label class="choicer">\
                <input type="checkbox" value="' + id + '">\
                    <span class="' + item_class + '"' + item_tooltip + '>\
                        <span class="choicer__bg"><span>' + title + '</span><i></i></span>\
                    </span>\
                </label>';

            if ((i % Math.ceil(directions.length / 3)) == 0) {
                html += '</div><div class="step__form-column">';
            }
        });
        html += '</div>';
        $container.append(html);

        init_choose_directions();
        init_tooltip();
    };


    // **** step 4 ****
    var init_choose_specialities = function () {
        $('#form-choose-specialities input[type="radio"]').on('click', function () {
            user_choose.speciality = $(this).val();
            clear_next_steps(4);
        });
    };
    step_handlers.step4 = function () {
        var direc_spec = [];
        _.each(user_choose.directions, function (direction_id) {
            direc_spec.push(_data.directions_to_specialities[user_choose.who][user_choose._class][direction_id]);
        });

        var specialities = [];
        _.each(direc_spec, function (item, i) {
            specialities.push(item);
        });
        specialities = _.unique(_.flatten(specialities));

        var $container = $('#form-choose-specialities');

        $container.empty();

        var html = '<div class="step__form-column">';
        _.each(specialities, function (id, i) {
            i++;
            var title = wordwrap(_specialities[id], 22);
            if (title.length > 1) {
                title = title.join('</span><i></i></span><span class="choicer__bg"><span>');
            } else {
                title = title.pop();
            }

            var item_class = 'choicer__text';
            var item_tooltip = '';
            if (_specialities_tooltips[id]) {
                item_class += ' js-ttip';
                _specialities_tooltips[id].link = 's' + id;
                item_tooltip = build_tooltip(_specialities_tooltips[id])
            }

            html += '<label class="choicer">\
                <input type="radio" name="speciality" value="' + id + '">\
                    <span class="' + item_class + '"' + item_tooltip + '>\
                        <span class="choicer__bg"><span>' + title + '</span><i></i></span>\
                    </span>\
                </label>';

            if ((i % Math.ceil(specialities.length / 3)) == 0) {
                html += '</div><div class="step__form-column">';
            }
        });
        html += '</div>';
        $container.append(html);
        init_choose_specialities();
        init_tooltip();

        var $radio = $('#form-choose-specialities input[type=radio][value=' + user_choose.speciality + ']');
        if ($radio.length) {
            $radio.attr('checked', true);
        } else {
            user_choose.speciality = null;
        }

        $radio = $('#form-choose-specialities input[type=radio]');
        if ($radio.length == 1){
            $radio.trigger('click');
        }
    };

    // step 5
    var init_choose_sp = function () {
        $('#form-choose-sp input[type="radio"]').on('click', function () {
            user_choose.sp = $(this).val();
            $.getJSON('/opendays.json', {structuraldepartment_id: user_choose.sp}, function (json) {
                current_opendays = json;
                if (current_opendays.length > 0) {
                    var _d = current_opendays[0].split('-');
                    _d[0] = String('0' + _d[0]).slice(-2);
                    _d[1] = String('0' + _d[1]).slice(-2);
                    _d = _d.join('.');

                    on_select_openday(_d);
                }
            });
        });
    };
    step_handlers.step5 = function () {
        var struct_deps = [];
        struct_deps.push(_data.specialities_to_sp[user_choose.speciality]);
        struct_deps = _.unique(_.flatten(struct_deps)).sort();

        var $container = $('#form-choose-sp');

        $container.empty();

        var html = '';
        _.each(struct_deps, function (id, i) {
            i++;
            html += '<label class="choicer">\
                <input type="radio" name="sp" value="' + id + '">\
                    <span class="choicer__text">\
                        <span class="choicer__bg"><span>' + _struct_deps[id].title + '</span><i></i></span>\
                        <span class="choicer__info"></span>\
                    </span>\
                </label>';
        });
        map_route(struct_deps);

        $container.append(html);

        init_choose_sp();

        var $radio = $('#form-choose-sp input[type=radio][value=' + user_choose.sp + ']');
        if ($radio.length) {
            $radio.attr('checked', true);
        } else {
            user_choose.sp = null;
        }

        $radio = $('#form-choose-sp input[type=radio]');
        if ($radio.length == 1){
            $radio.trigger('click');
        }
    };


    // **** step 6 ****
    window.step6_choose = function (what) {
        var mapper = {
            'opendays': 'ДОД',
            'onlineform': 'Заявка',
            'callback': 'Перезвонить мне'
        };
        step7form = what;

        $('#js-hidden-type').val(mapper[what]);

        $('.js-from-group-opendaydate').hide();
        $('.js-from-group-email').show();

        switch (what) {
            case 'opendays':
                $('.js-from-group-opendaydate').show();
                break;
            case 'callback':
                $('.js-from-group-email').hide();
                break;
        }
    };
    window.step6_check = function () {
        for (var i in user_choose) {
            switch (i) {
                case 'who':
                    $('#js-hidden-' + i).val('Кто: ' + user_choose[i]);
                    break;
                case '_class':
                    $('#js-hidden-' + i).val('Класс: ' + user_choose[i]);
                    break;
                case 'directions':
                    var _d = [];
                    _.each(user_choose[i], function (id) {
                        _d.push(_directions[id]);
                    });
                    $('#js-hidden-' + i).val('Направления: ' + _d.join("\n"));
                    break;
                case 'speciality':
                    $('#js-hidden-' + i).val('Специальность: ' + _specialities[user_choose[i]]);
                    break;
                case 'sp':
                    $('#js-hidden-' + i).val('СП: ' + _struct_deps[user_choose[i]].title);
                    break;
            }
        }

        $('#form-opendays').ajaxSubmit({
            beforeSubmit: function () {
                var $form = $('#form-opendays');

                if ($('.js-from-group-opendaydate', $form).is(':visible')) {
                    if ($('#js-field-opendays').val() == '') {
                        alert('Дата обязательное поле');
                        return false;
                    }
                }

                if ($('input[name=fio]', $form).val() == '') {
                    alert('ФИО обязательное поле');
                    return false;
                }
                if ($('input[name=phone]', $form).val() == '') {
                    alert('Телефон обязательное поле');
                    return false;
                }
                return true;
            },
            success: function (json) {
                if (json.success) {
                    try {
                        yaCounter21615259.reachGoal('step' + step7form);
                    } catch (e){}
                    window.location.href = '/#/step/8';
                } else {
                    alert("Что-то пошло не так.\nВсе поля заполнили?\nПопробуйте обновить страницу.");
                }
            }
        });

        return false;
    };

    step_handlers.step6 = function () {
        var $container = $('#speciality-sp-result');
        var _speciality_title = null;

        if (_.contains(_data.specialities_to_sp[user_choose.speciality], parseInt(user_choose.sp))) {
            _speciality_title = _specialities[user_choose.speciality];
        }
        $container.empty();
        $container.append(_speciality_title);
        $container.append('<em>в отделение колледжа ' + _struct_deps[user_choose.sp].title + '</em>');
    };


    // **** step 7 ****
    step_handlers.step7 = function () {
        var $container = $('#sp-opendays-result');
        $container.empty();

        var descr = {
            'opendays': 'и запишись на день открытых дверей<br><em>в отделение колледжа',
            'onlineform': 'и поступи к нам в колледж уже сейчас<br><em>в отделение колледжа',
            'callback': 'и наш сотрудник перезвонит тебе в ближайшее время и ответит на все твои вопросы<br><em>из отделения колледжа'
        };

        $container.append(descr[step7form] + ' ' + _struct_deps[user_choose.sp].title + '</em>');
    };

    // **** step 8 ****
    step_handlers.step8 = function () {
        var text = 'Мы обязательно свяжемся с тобой и пригласим пообщаться в ближайшее время!';
        if (step7form == 'opendays') {
            text = 'Мы обязательно свяжемся с тобой и  будем рады видеть на Дне открытых дверей ' + selected_openday;
        }
        $('#js-step8-text').empty().append(text + '<br>Если у тебя остались какие-то вопросы, звони: <a href="tel:+74996537077">+7 (499) 653-70-77</a>');
    };

    // **** app ****
    this.before({except: {path: ['#/step/0', '#/step/1']}}, function () {
        var step = this.params['step'], ret = true;

        var prev_step = step - 1;

        var choose_name = step_to_user_choose_mapper[prev_step];

        if (_.isArray(user_choose[choose_name]) && user_choose[choose_name].length == 0) {
            ret = false;
        } else if (_.isNull(user_choose[choose_name])) {
            ret = false;
        }

        if (!ret) {
            this.redirect('#/step/' + prev_step);
            $('.step__title', '#step_'+prev_step).effect('shake');
        }

        if (from_speciality_page && (step == 3 || step == 4)) {
            this.redirect('#/step/5');
            from_speciality_page = false;
            return false;
        }

        return ret;
    });

    this.get('/#/', function () {
        this.redirect('#/step/0');
    });
    this.get('#/step/:step', function () {
        var step = this.params['step'];

        $('.step').removeClass('is-active');
        $('#step_' + step).addClass('is-active');
        $('#nav-steps a').removeClass('is-active');
        $('#menu-step-' + step).addClass('is-active');

        if (_.isFunction(step_handlers['step' + step])) {
            step_handlers['step' + step]();
        }
        try {
            yaCounter21615259.reachGoal('step' + step);
        } catch (e){}

    });
});
