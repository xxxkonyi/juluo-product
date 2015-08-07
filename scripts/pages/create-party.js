/**
 * Code by baixiaosheng on 2015/7/30.
 */
var CreateParty = function () {

    var initComponent = function () {
        if (jQuery().datepicker) {
            $.fn.datepicker.dates['zh-CN'] = {
                days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
                daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
                months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                today: "今日",
                format: "yyyy年mm月dd日",
                weekStart: 1,
                clear: "清空"
            };
            $('.date-picker').datepicker({
                orientation: "left",
                autoclose: true,
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                startDate: '0d',
                todayHighlight: true
            });

        }
        if (jQuery().timepicker) {
            $('.timepicker').timepicker({
                autoclose: true,
                minuteStep: 5,
                showSeconds: false,
                showMeridian: false
            });
        }

        $('input[type="file"][name="poster"]').on('change', function (e) {
            var files = e.target.files === undefined ? (e.target && e.target.value ? [{name: e.target.value.replace(/^.+\\/, '')}] : []) : e.target.files;
            var file = files[0];
            if ((typeof file.type !== "undefined" ? file.type.match(/^image\/(gif|png|jpeg)$/) : file.name.match(/\.(gif|png|jpe?g)$/i)) && typeof FileReader !== "undefined") {
                var reader = new FileReader();
                var _that = this;
                reader.onload = function (re) {
                    $(_that).parent().css('background-image', 'url(' + re.target.result + ')');
                };

                reader.readAsDataURL(file);
            }
        });
        $('.JL-party-create-img-body li').on('click', function () {
            $('input[type="file"][name="poster"]').val('');
            $('.JL-party-create-img-body-left').css('background-image', 'url(' + $(this).children('img')[0].src + ')');
            $('input[name="poster2"]').val($(this).children('img').attr('date-src'));
        });
    };

    return {
        init: function () {
            initComponent();
        }
    }
}();