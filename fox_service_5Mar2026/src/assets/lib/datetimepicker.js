(function ($) {
    'use strict';
    $.fn.dateTimePicker = function (options) {

        var settings = $.extend({
            selectData: "now",
            dateFormat: 'MM-DD-YYYY',
            showTime: false,
            locale: 'en',
            positionShift: {top: 20, left: 0},
            title: "Select Date ",
            buttonTitle: "Select"
        }, options);
        moment.locale(settings.locale);
        var elem = this;
        var limitation = {"hour": 12, "minute": 59};
        var mousedown = false;
        var timeout = 800;
        var selectDate = settings.selectData == "now" ? moment() : moment(settings.selectData, settings.dateFormat);
        if (selectDate < moment()) {
            selectDate = moment();

        }
        var startDate = copyDate(moment());
        var lastSelected = copyDate(selectDate);

        return this.each(function () {
            if (lastSelected != selectDate) {
                selectDate = copyDate(lastSelected);
            }

            elem.addClass("dtp_main");
            updateMainElemGlobal();
            //  elem.text(selectDate.format(settings.dateFormat));
            function updateMainElemGlobal() {

                var arrF = settings.dateFormat.split(' ');

                if (settings.showTime && arrF.length != 2) {
                    arrF.length = 2;
                    arrF[0] = 'MM-DD-YYYY';
                    arrF[1] = 'hh:mm a';
                }
                var $s = $('<span>');
                $s.text(lastSelected.format(arrF[0]));

                elem.empty();
                elem.append($s);
                $s = $('<i>');
                $s.addClass('fa fa-calendar ico-size');
                elem.append($s);
                if (settings.showTime) {
                    $s = $('<span>');



                    console.log(lastSelected.format(arrF[1]))
                    $s.text(lastSelected.format(arrF[1]));
                    elem.append($s);
                    $s = $('<i>');
                    $s.addClass('fa fa-clock-o ico-size');
                    elem.append($s);
                }
            }
            elem.on('click', function () {
                var $win = $('<div>');
                $win.addClass("dtp_modal-win");
                var $body = $('body');
                $body.append($win);
                var $content = createContent();
                $body.append($content);
                var offset = elem.offset();
                $content.css({top: (offset.top + settings.positionShift.top) + "px", left: (offset.left + settings.positionShift.left) + "px"});
                feelDates(selectDate);
//                $win.on('click', function () {
//                    $content.remove();
//                    $win.remove();
//                })
                if (settings.showTime) {
                    attachChangeTime();
                    var $fieldTime = $('#field-time');
                    var $hour = $fieldTime.find('#d-hh');
                    var $minute = $fieldTime.find('#d-mm');
                    var $meridiem = $fieldTime.find('#d-am');
                }

                function feelDates(selectM) {
                    var $fDate = $content.find('#field-data');
                    $fDate.empty();
                    $fDate.append(createMonthPanel(selectM));
                    $fDate.append(createCalendar(selectM));
                }

                function createCalendar(selectedMonth) {
                    var $c = $('<div>');
                    $c.addClass('dtp_modal-calendar');
                    for (var i = 0; i < 7; i++) {
                        var $e = $('<div>');
                        $e.addClass('dtp_modal-calendar-cell dtp_modal-colored');
                        $e.text(moment().weekday(i).format('ddd'));
                        $c.append($e);
                    }
                    var m = copyDate(selectedMonth);
                    m.date(1);
                    // console.log(m.format('DD--MM--YYYY'));
                    // console.log(selectData.format('DD--MM--YYYY'));
                    // console.log(m.weekday());
                    var flagStart = totalMonths(selectedMonth) === totalMonths(startDate);
                    var flagSelect = totalMonths(lastSelected) === totalMonths(selectedMonth);
                    var cerDay = parseInt(selectedMonth.format('D'));
                    var dayNow = parseInt(startDate.format('D'));
                    for (var i = 0; i < 6; i++) {
                        for (var j = 0; j < 7; j++) {
                            var $b = $('<div>');
                            $b.html('&nbsp;');
                            $b.addClass('dtp_modal-calendar-cell');
                            if (m.month() == selectedMonth.month() && m.weekday() == j) {
                                var day = parseInt(m.format('D'));
                                $b.text(day);
                                if (flagStart && day < dayNow) {
                                    $b.addClass('dtp_modal-grey');
                                } else if (flagSelect && day == cerDay) {
                                    $b.addClass('dtp_modal-cell-selected');
                                } else {
                                    $b.addClass('cursorily');
                                    $b.bind('click', changeDate);
                                }
                                m.add(1, 'days');
                            }
                            $c.append($b);
                        }
                    }
                    return $c;
                }

                function changeDate() {
                    var $div = $(this);
                    selectDate.date($div.text());
                    lastSelected = copyDate(selectDate);
                    updateDate();
                    var $fDate = $content.find('#field-data');
                    var old = $fDate.find('.dtp_modal-cell-selected');
                    old.removeClass('dtp_modal-cell-selected');
                    old.addClass('cursorily');
                    $div.addClass('dtp_modal-cell-selected');
                    $div.removeClass('cursorily');
                    old.bind('click', changeDate);
                    $div.unbind('click');
                    // console.log(selectDate.format('DD-MM-YYYY'));
                }

                function createMonthPanel(selectMonth) {
                    var $d = $('<div>');
                    $d.addClass('dtp_modal-months');
                    var $s = $('<i></i>');
                    $s.addClass('fa fa-angle-left cursorily ico-size-month hov');
                    //$s.attr('data-fa-mask', 'fas fa-circle');
                    $s.bind('click', prevMonth);
                    $d.append($s);
                    $s = $('<span>');
                    $s.text(selectMonth.format("MMMM YYYY"));
                    $d.append($s);
                    $s = $('<i></i>');
                    $s.addClass('fa fa-angle-right cursorily ico-size-month hov');
                    $s.bind('click', nextMonth);
                    $d.append($s);
                    return $d;
                }

                function close() {
                    if (settings.showTime) {
                        console.log(lastSelected.hour(parseInt($hour.text())))

                        lastSelected.hour(parseInt($hour.text()));
                        lastSelected.minute(parseInt($minute.text()));
//                        lastSelected.meridiem($meridiem.text());

                        selectDate.hour(parseInt($hour.text()));
                        selectDate.minute(parseInt($minute.text()));
//                        selectDate.meridiem($meridiem.text());

                    }
                    updateDate();
                    $content.remove();
                    $win.remove();
                }

                function nextMonth() {
                    selectDate.add(1, 'month');
                    feelDates(selectDate);
                }

                function prevMonth() {
                    if (totalMonths(selectDate) > totalMonths(startDate)) {
                        selectDate.add(-1, 'month');
                        feelDates(selectDate);
                    }
                }

                function attachChangeTime() {
                    var $angles = $($content).find('i[id^="angle-"]');
                    // $angles.bind('click', changeTime);
                    $angles.bind('mouseup', function () {
                        mousedown = false;
                        timeout = 800;
                    });
                    $angles.bind('mousedown', function () {
                        mousedown = true;
                        changeTime(this);
                    });
                }

                function changeTime(el) {
                    var $el = this || el;
                    $el = $($el);
                    ///angle-up-hour angle-up-minute angle-down-hour angle-down-minute
                    var arr = $el.attr('id').split('-');

                    console.log("arr" + arr)

                    if (arr[2] === 'am') {
                        var meridiem = $("#d-am").text();
                        var newMeridiem = (meridiem === 'pm') ? 'am' : 'pm';
                        $("#d-am").text(newMeridiem)
                        appendMeriadian(meridiem);
                    } else if (arr[2] === 'minute') {

                        var increment = 15;
                        if (arr[1] == 'down') {

                            increment = -15;
                        }
                        appendIncrement(arr[2], increment);

                        setTimeout(function () {
                            autoIncrement($el);
                        }, timeout);
                    } else {
                        var increment = 1;
                        if (arr[1] == 'down') {
                            increment = -1;
                        }
                        appendIncrement(arr[2], increment);

                        setTimeout(function () {
                            autoIncrement($el);
                        }, timeout);
                    }
                }

                function autoIncrement(el) {
                    if (mousedown) {
                        if (timeout > 200) {
                            timeout -= 200;
                        }
                        changeTime(el);
                    }
                }

                function appendIncrement(typeDigits, increment) {
                    var $i = typeDigits === "hour" ? $hour : $minute;

                    if ($i === $minute) {
                        if ($i.text() === '00') {
                            if (increment === -15) {
                                val = 45;
                            } else {
                                val = 15;
                            }
                        } else if ($i.text() === '45') {
                            if (increment === -15) {
                                val = 30;
                            } else {
                                val = 0;
                            }
                        } else {
                            var val = parseInt($i.text()) + increment;
                        }
                    } else {
                        if ($i.text() === '12') {
                            if (increment === 1) {
                                val = 1;
                            } else {
                                val = 11;
                            }
                        } else if ($i.text() === '01') {
                            if (increment === -1) {
                                val = 12;
                            } else {
                                val = 2;
                            }
                        } else {
                            var val = parseInt($i.text()) + increment;
                        }
                    }


//                    if (val < 0) {
//                        val = limitation[typeDigits];
//                    } else if (val > limitation[typeDigits]) {
//                        val = 0;
//                    }
                    $i.text(formatDigits(val));
                }
                function appendMeriadian(meridiem) {
                    var $i = $meridiem;
                    if (meridiem === 'am') {
                        meridiem = 'pm'
                    } else {
                        meridiem = 'am'
                    }
                    $i.text(meridiem);
                }

                function formatDigits(val) {

                    if (val < 10) {
                        return '0' + val;
                    }
                    return val;
                }


                function createTimer() {
                    var $div = $('<div>');
                    $div.addClass('dtp_modal-time-mechanic');
                    var $panel = $('<div>');
                    $panel.addClass('dtp_modal-append');


                    var $i = $('<i>');
                    $i.attr('id', 'angle-up-hour');
                    $i.addClass('fa fa-angle-up ico-size-large cursorily hov');
                    $panel.append($i);

                    var $m = $('<span>');
                    $m.addClass('dtp_modal-midle');
                    $panel.append($m);

                    $i = $('<i>');
                    $i.attr('id', 'angle-up-minute');
                    $i.addClass('fa fa-angle-up ico-size-large cursorily hov');
                    $panel.append($i);

                    var $m = $('<span>');
                    $m.addClass('dtp_modal-midle');
                    $panel.append($m);

                    $i = $('<i>');
                    $i.attr('id', 'angle-up-am');
                    $i.addClass('fa fa-angle-up ico-size-large cursorily hov');
                    $panel.append($i);


                    $div.append($panel);
                    $panel = $('<div>');
                    $panel.addClass('dtp_modal-digits');

                    var min2 = parseFloat(lastSelected.format('mm'));
                    var hor = parseFloat(lastSelected.format('hh'));
                    var amp = lastSelected.format('a');
                    var ndt = new Date().getHours();

                    if (min2 > 0 && min2 < 15) {
                        min2 = "15";
                    } else if (min2 > 15 && min2 < 30) {
                        min2 = "30";
                    } else if (min2 > 30 && min2 < 45) {
                        min2 = "45";
                    } else if (ndt === 12 && (min2 > 45 && min2 < 59)) {
                        min2 = "00";
                        hor = "01";
                    } else if (ndt === 11 && (min2 > 45 && min2 < 60)) {
                        min2 = "00";
                        hor = '12';
                        if (amp === 'am') {
                            amp = 'pm'
                        } else {
                            amp = 'am'
                        }
                    } else if (ndt !== 11 && ndt !== 12 && (min2 > 45 && min2 < 59)) {
                        min2 = "00";
                        hor = hor + 1;
                        hor = JSON.stringify(hor);

                    }
                    if (hor.length < 2) {
                        hor = "0" + hor;
                    }
                    if (min2.length < 2) {
                        min2 = "0" + min2;
                    }


                    var $d = $('<span>');
                    $d.addClass('dtp_modal-digit');
                    $d.attr('id', 'd-hh');
                    $d.text(hor);
                    $panel.append($d);


                    $m = $('<span>');
                    $m.addClass('dtp_modal-midle-dig');
                    $m.html(':');
                    $panel.append($m);


                    $d = $('<span>');
                    $d.addClass('dtp_modal-digit');
                    $d.attr('id', 'd-mm');

                    // $d.text(lastSelected.format('mm'));
                    $d.text(min2);
                    $panel.append($d);

                    var $n = $('<span>');
                    $n.addClass('dtp_modal-midle-dig');
                    $n.html(':');
                    $panel.append($n);

                    $d = $('<span>');
                    $d.addClass('dtp_modal-digit');
                    $d.attr('id', 'd-am');
                    $d.text(amp);
                    $panel.append($d);


                    $div.append($panel);
                    $panel = $('<div>');
                    $panel.addClass('dtp_modal-append');

                    $i = $('<i>');
                    $i.attr('id', 'angle-down-hour');
                    $i.addClass('fa fa-angle-down ico-size-large cursorily hov');
                    $panel.append($i);


                    $m = $('<span>');
                    $m.addClass('dtp_modal-midle');
                    $panel.append($m);


                    $i = $('<i>');
                    $i.attr('id', 'angle-down-minute');
                    $i.addClass('fa fa-angle-down ico-size-large cursorily hov');
                    $panel.append($i);


                    $m = $('<span>');
                    $m.addClass('dtp_modal-midle');
                    $panel.append($m);

                    $i = $('<i>');
                    $i.attr('id', 'angle-down-am');
                    $i.addClass('fa fa-angle-down ico-size-large cursorily hov');
                    $panel.append($i);

                    $div.append($panel);
                    return $div;
                }
                
                function gotoback(){
                    close();
                }

                function createContent() {
                    var $c = $('<div>');
                    if (settings.showTime) {
                        $c.addClass("dtp_modal-content");
                    } else {
                        $c.addClass("dtp_modal-content-no-time");
                    }
                    var $el = $('<div>');
                    $el.addClass("dtp_modal-title");
                    
                    var $cross = $("<span>");
                    $cross.text("X");
                     $cross.addClass("cross-icn");
                    $cross.bind('click', gotoback);
                    $c.append($cross);
                    
                    
                    $el.text(settings.title);
                    $c.append($el);
                    $el = $('<div>');
                    $el.addClass('dtp_modal-cell-date');
                    $el.attr('id', 'field-data');
                    $c.append($el);
                    if (settings.showTime) {
                        $el = $('<div>');
                        $el.addClass('dtp_modal-cell-time');
                        var $a = $('<div>');
                        $a.addClass('dtp_modal-time-block');
                        $a.attr('id', 'field-time');
                        $el.append($a);
                        var $line = $('<div>');
                        $line.attr('id', 'time-line');
                        $line.addClass('dtp_modal-time-line');
                        $line.text(lastSelected.format(settings.dateFormat));

                        $a.append($line);
                        $a.append(createTimer());
                        var $but = $('<div>');
                        $but.addClass('dpt_modal-button');
                        $but.text(settings.buttonTitle);
                        $but.bind('click', close);
                        $el.append($but);
                        $c.append($el);
                    }
                    return $c;
                }
                function updateDate() {
                    if (settings.showTime) {
                        $('#time-line').text(lastSelected.format(settings.dateFormat));
                    }
                    updateMainElem();

                    var arrF = settings.dateFormat.split(' ');
                    if (settings.showTime && arrF.length != 2) {
                        arrF.length = 3;
                        arrF[0] = 'MM-DD-YYYY';
                        arrF[1] = 'hh:mm';
                    }
                    var $m = $("#d-am").text();


                    var newval = lastSelected.format(arrF[0]) + " " + lastSelected.format(arrF[1]) + " " + $m;
                    elem.next().val(newval);


                    if (!settings.showTime) {
                        $content.remove();
                        $win.remove();
                    }
                }

                function updateMainElem() {

                    var arrF = settings.dateFormat.split(' ');

                    if (settings.showTime && arrF.length != 2) {
                        arrF.length = 3;
                        arrF[0] = 'MM-DD-YYYY';
                        arrF[1] = 'hh:mm';
                    }

                    var $m = $("#d-am").text();


                    var $s = $('<span>');
                    $s.text(lastSelected.format(arrF[0]));
                    elem.empty();
                    elem.append($s);
                    $s = $('<i>');
                    $s.addClass('fa fa-calendar ico-size');
                    elem.append($s);

                    if (settings.showTime) {
                        $s = $('<span>');

                        $s.text(lastSelected.format(arrF[1]) + " " + $m);
                        elem.append($s);


                        $s = $('<i>');
                        $s.addClass('fa fa-clock-o ico-size');
                        elem.append($s);
                    }
                }

            });

        });

    };

    function copyDate(d) {
        return moment(d.toDate());
    }

    function totalMonths(m) {
        var r = m.format('YYYY') * 12 + parseInt(m.format('MM'));
        return r;
    }

}(jQuery));
// fa-caret-down