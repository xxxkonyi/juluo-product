/**
 * Code by baixiaosheng on 2015/8/3.
 */
var Map = function () {

    var initMap = function () {
        var map = new BMap.Map('JL_map');
        map.centerAndZoom('成都', 13);
        map.addControl(new BMap.NavigationControl());
        map.enableScrollWheelZoom(true);
        map.setCurrentCity("成都");
        map.addEventListener("click",function(e){
            $('input[name="longitude"]').val(e.point.lng).change();
            $('input[name="latitude"]').val(e.point.lat).change();
            var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat));
            map.clearOverlays();
            // 创建地理编码实例
            var myGeo = new BMap.Geocoder();
            // 根据坐标得到地址描述
            myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function(result){
                if (result){
                    $('input[name="address"]').val(result.address).change();
                }
            });
            map.addOverlay(marker);
        });
    };
    return {
        init: function () {
            initMap();
        }
    }
}();