ymaps.ready(map_init);

var yandex_map, yandex_map_sp_collection;

function map_route(struct_deps) {
    yandex_map_sp_collection.removeAll();
    _.each(struct_deps, function (id, i) {
        yandex_map_sp_collection.add(new ymaps.Placemark(_struct_deps[id].center, {}, {
            "iconImageHref": "http://p26.rocketcdn.ru/map/i/sp-" + id + ".png",
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

    app.run('#/');
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


var app = $.sammy(function () {

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
        5: 'sp'
    };

    // if from speciality page
    var COOKIE_SPECIALITY = 'spec';
    var from_speciality_page = false;

    if (!_.isUndefined($.cookie(COOKIE_SPECIALITY))) {
        user_choose.speciality = parseInt($.cookie(COOKIE_SPECIALITY));
        if (!isNaN(user_choose.speciality)){
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

    window.user_choose = user_choose;

    //var _classes = [9, 10, 11];

    var step_handlers = {};
    // step 1
    window.choose_who = function (who) {
        user_choose.who = who;
    };


    // ***** step 2 *****
    window.choose_class = function (_class) {
        user_choose._class = _class;
    };
    step_handlers.step2 = function () {
        init_choose_class();
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
            html += '<label class="choicer">\
                <input type="checkbox" value="' + id + '">\
                    <span class="choicer__text">\
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

            html += '<label class="choicer">\
                <input type="radio" name="speciality" value="' + id + '">\
                    <span class="choicer__text">\
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

        var $radio = $('#form-choose-specialities input[type=radio][value=' + user_choose.speciality + ']');
        if ($radio.length) {
            $radio.attr('checked', true);
        } else {
            user_choose.speciality = null;
        }
    };

    // step 5
    var init_choose_sp = function () {
        $('#form-choose-sp input[type="radio"]').on('click', function () {
            user_choose.sp = $(this).val();
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
    };


    // **** step 6 ****
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

        var opendays = _struct_deps[user_choose.sp].opendays.join(', ');

        $container.append('и запишись на день открытых дверей<br><em>в отделении колледжа ' + _struct_deps[user_choose.sp].title + ' (' + opendays + ') <a href="#">все даты</a></em>');
    }


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
        }

        if (from_speciality_page && (step == 3 || step == 4)) {
            console.debug('yaaa', step);
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
    });
});
