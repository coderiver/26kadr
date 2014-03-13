ymaps.ready(map_init);

var myMap;

map_route = function (sp_number, sp) {

    console.log('map_route:', sp_number);

    myMap.geoObjects.add(new ymaps.Placemark(sp.center, {}, {
        "iconImageHref": "http://p26.rocketcdn.ru/map/i/sp-" + sp_number + ".png",
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
}


function map_init() {
    myMap = new ymaps.Map('map-container', {
        center: [55.753676, 37.619899],
        zoom: 11,
        behaviors: ['default', 'scrollZoom']
    });

    myMap.controls.add('zoomControl', { top: 50, right: 10 });

//    var mapTools = new ymaps.control.MapTools({ items: ["drag", "magnifier"]});
//    myMap.controls.add(mapTools);


    init_choose_class();
    app.run('#/');
}


var app = $.sammy(function () {

    var user_choose = {
        'who': 'boy',
        '_class': '9',
        'directions': [],
        'specialties': [],
        'sp':null
    };
    window.user_choose = user_choose;

    var _classes = [7, 8, 9, 10, 11];


    var _struct_deps = {
        1: {
            'title': '#1: на ул.Цимлянская',
            "center": [
                55.66865,
                37.769882
            ]
        },
        2: {
            'title': '#2: на ул.Кожуховская',
            "center": [
                55.704463,
                37.67961
            ]
        },
        3: {
            'title': '#3: на ул.Фрезерная',
            "center": [
                55.739818,
                37.741387
            ]
        },
        4: {
            'title': '#4: на ул.Шкулева',
            "center": [
                55.6943,
                37.75134
            ]
        },
        5: {
            'title': '#5: на ул.Карачаровская',
            "center": [
                55.736367,
                37.757494
            ]
        },
        6: {
            'title': '#6: на ул.Трофимова',
            "center": [
                55.70386,
                37.679844
            ]
        },
        7: {
            'title': '#7: на ул.Красноказарменная',
            "center": [
                55.741227,
                37.705778
            ]
        },
        8: {
            'title': '#8: на ул.Подъемная',
            "center": [
                55.756964,
                37.697657
            ]
        },
        9: {
            'title': '#9: на шоссе Энтузиастов',
            "center": [
                55.753448,
                37.72467
            ]
        }
    };

    var _directions = {
        1: 'Строительство и эксплуатация зданий и сооружений',
        2: 'Архитектура',
        3: 'Реставрация',
        4: 'Дизайн',
        5: 'Инженерные сети',
        6: 'Отделка',
        7: 'Мебель и деревянное домостроение',
        8: 'Информационные технологии',
        9: 'Переработка нефти и газа и тонкой химической технологии',
        10: 'Логистика',
        11: 'Автодело',
        12: 'Гуманитарные науки'
        /*13: 'ООШ'*/
    };


    var _data = {
        'class_to_directions': {
            'boy': {
                /* class => directions */
                9: [1, 2, 3, 4, 5, 6, 7, 8, 12],
                10: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
                11: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
        },
        'directions_to_specialties': {
            'boy': {
                9: {
                    1: [1, 2],
                    2: [3],
                    3: [5],
                    4: [6],
                    5: [7, 8, 9, 10],
                    6: [11, 12],
                    7: [13],
                    8: [16],
                    9: [18],
                    12: [25]
                },
                10: {
                    1: [1, 2],
                    2: [3],
                    3: [5],
                    4: [6],
                    5: [7, 8, 9, 10],
                    6: [11, 12],
                    7: [13],
                    8: [16],
                    9: [18],
                    12: [25]
                },
                11: {
                    1: [1],
                    2: [3],
                    3: [4, 5],
                    4: [6],
                    5: [7],
                    6: [11],
                    7: [13, 14],
                    8: [15, 16, 17],
                    9: [19],
                    10: [20, 21],
                    11: [22, 23],
                    12: [24, 25]
                }
            }
        },
        'specialties_to_sp': {
            1: [1],
            2: [1],
            3: [2],
            4: [6],
            5: [6],
            6: [2],
            7: [1, 3, 7],
            8: [1, 3, 7],
            9: [1, 3, 7],
            10: [1, 3, 7],
            11: [4],
            12: [4],
            13: [5, 6],
            14: [5, 6],
            15: [4, 5],
            16: [4, 5],
            17: [4, 5],
            18: [9],
            19: [9],
            20: [8],
            21: [8],
            22: [1, 7],
            23: [1, 7]
        }
    };

    var _specialties = {
        1: 'Строительство и эксплуатация зданий и сооружений',
        2: 'Сварщик (электросварочные и газосварочные работы)',
        3: 'Архитектура',
        4: 'Реставрация',
        5: 'Реставратор строительный',
        6: 'Дизайн (по отраслям)',
        7: 'Мастер жилищо-коммунального хозяйства',
        8: 'Техническая эксплуатация и обслуживание электрического и электромеханического оборудования (по отраслям)',
        9: 'Электромонтер по ремонту и обслуживанию электрооборудования (по отраслям)',
        10: 'Электромонтажник сигнализации, централизации, блокировке',
        11: 'Мастер отделочных строительных работ',
        12: 'Специалист по строительным технологиям (мастер сухого строительства)',
        13: 'Мастер столярного и мебельного производства',
        14: 'Технология деревообработки ',
        15: 'Наладчик программного и аппаратного обеспечения',
        16: 'Компьютерные сети',
        17: 'Информационные системы',
        18: 'Химическая технология органических веществ',
        19: 'Специалист по анализу химических веществ (лаборант-аналитик)',
        20: 'Операционная деятельность в логистике',
        21: 'Организация перевозок и управление на транспорте (по видам)',
        22: 'Слесарь по ремонту строительных машин',
        23: 'Мастер шиномонтажной мастерской',
        24: 'Профессиональное обучение',
        25: 'Право и организация социального обеспечения'
    };

    window.choose_who = function (who) {
        user_choose.who = who;
    };

    window.choose_class = function (_class) {
        user_choose._class = _class;
    };

    window.init_choose_class = function () {
        $('#form-choose-class input[type="radio"]').on('click', function () {
            user_choose._class = $(this).val();
        });
    };

    var init_choose_directions = function () {
        $('#form-choose-directions input[type="checkbox"]').on('click', function () {

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
        });
    };

    // step 4
    var init_choose_specialties = function () {
        $('#form-choose-specialties input[type="checkbox"]').on('click', function () {

            if (this.checked) {
                user_choose.specialties.push($(this).val());
            } else {
                user_choose.specialties = _.without(user_choose.specialties, $(this).val());
            }

            user_choose.specialties = _.uniq(user_choose.specialties);
        });
    };

//    var init_map = function(){
//        if ( ! _.undefined(window.appMap)){
//            return;
//        }
//
//        window.appMap = new ymaps.Map('map-container', {
//            center: [55.753676, 37.619899],
//            zoom: 11,
//            behaviors: ['default', 'scrollZoom']
//        });
//    }

    var step2 = function () {
        console.log('step2:');
    };

    var step3 = function () {
        console.log('step3:');

        //user_choose.directions = [];

        var directions = _data.class_to_directions[user_choose.who][user_choose._class];

        var $container = $('#form-choose-directions');

        $container.empty();

        var html = '<div class="step__form-column">';
        _.each(directions, function (id, i) {
            i++;
            html += '<label class="choicer">\
                <input type="checkbox" value="' + id + '">\
                    <span class="choicer__text">\
                        <span class="choicer__bg"><span>' + _directions[id] + '</span><i></i></span>\
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

    var step4 = function () {
        console.log('step4:');

        //user_choose.specialties = [];

        var direc_spec = [];
        _.each(user_choose.directions, function (direction_id) {
            direc_spec.push(_data.directions_to_specialties[user_choose.who][user_choose._class][direction_id]);
        });

        var specialties = [];
        _.each(direc_spec, function (item, i) {
            specialties.push(item);
        });
        specialties = _.unique(_.flatten(specialties));

        var $container = $('#form-choose-specialties');

        $container.empty();

        var html = '<div class="step__form-column">';
        _.each(specialties, function (id, i) {
            i++;
            html += '<label class="choicer">\
                <input type="checkbox" value="' + id + '">\
                    <span class="choicer__text">\
                        <span class="choicer__bg"><span>' + _specialties[id] + '</span><i></i></span>\
                    </span>\
                </label>';

            if ((i % Math.ceil(specialties.length / 3)) == 0) {
                html += '</div><div class="step__form-column">';
            }
        });
        html += '</div>';
        $container.append(html);
        init_choose_specialties();
    };

    var step5 = function () {
        console.log('step5:');

        var struct_deps = [];
        _.each(user_choose.specialties, function (speciality_id) {
            struct_deps.push(_data.specialties_to_sp[speciality_id]);
        });
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

            map_route(id, _struct_deps[id]);
        });

        $container.append(html);
    };

    var step6 = function(){
        console.log('step6:');
    };


    //this.debug = true;

    this.get('/#/', function () {
        this.redirect('#/step/0');
    });
    this.get('#/step/:step', function () {
        var step = menu_step = this.params['step'];

        $('.step').removeClass('is-active');
        $('#step_' + step).addClass('is-active');
        $('#nav-steps a').removeClass('is-active');

        switch (step) {
            case '2':
                menu_step = 1;
                step2();
                break;
            case '3':
                step3();
                break;
            case '4':
                step4();
                break;
            case '5':
                step5();
                menu_step = 4;
                break;
        }
        $('#menu-step-' + menu_step).addClass('is-active');
    });
});
