/* function封装js文件，供C#后台调用 */
/* 站点布局页代码-- */
// 本地模拟数据--二维对象数组嵌套
$(function () {
    //创建地图实例--在指定id的DOM容器内创建
    var map = new BMap.Map("mapContainer");
    //信息窗口通用配置项
    var opts = {
        width: 0, // 信息窗口宽度
        height: 0, // 信息窗口高度
        offset: new BMap.Size(0, -10), //信息窗位置偏移值
        // title: data_info[i].title, // 信息窗口标题
        enableMessage: true //设置允许信息窗发送短息
    };
    mapInit(); //初始化地图
    // getBoundary(map,"北京市","北京市朝阳区","#fff",1); //显示朝阳区行政版块覆盖物
    getBoundary(map, "北京市朝阳区", "北京市朝阳区", "#16a085", 0.1); //显示朝阳区行政版块覆盖物
    //创建多个标注点并点击时触发信息窗口
    renderPoint(data_info, "stationList");
    //渲染地图右侧信息块 内容（tab导航）
    renderCenterList(data_info);
    //右侧导航--分中心列表项下分站列表的折叠展开
    $(".centerList").on("click", ".centerLink", centerItemClickHandler);
    //给每个分站项注册点击事件
    $(".stationList").on("click", "li", stationItemClickHandler);
    //定时器定时主动触发事件

    //2018-02-02 增加站点计时切换触发点击事件效果
    var timeId = setInterval(function () {
        var count = getActiveClassIndex();
        //站点定时轮换触发点击事件
        $($(".stationItem")[count]).trigger("click");
    }, 3000);



    //function：初始化地图配置
    function mapInit() {
        map.centerAndZoom('北京市朝阳区'); //初始化地图中心点及缩放级别，当中心点为字符串时,缩放级别可省略，自动适配
        // 百度地图API功能
        map.enableScrollWheelZoom(); //启用滚轮放大缩小
        // map.disableDragging();//禁用地图拖拽

        // 添加导航控件
        var navigationControl = new BMap.NavigationControl({ //此类表示地图的平移缩放控件
            // 靠左上角位置
            anchor: BMAP_ANCHOR_TOP_LEFT,
            // LARGE类型
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            // 启用显示定位
            // enableGeolocation: true
        });
        map.addControl(navigationControl);
        // var traffic = new BMap.TrafficLayer();
        // map.addTileLayer(traffic);
        // map.removeTileLayer(traffic);

    }

    //function:在地图上显示行政区域划分
    //参数：map:Map类实例对象; name: 查询省、直辖市、地级市、或县的名称;center:地图中心点；
    //fillColor：填充色, fillOpacity:填充不透明度
    function getBoundary(map, name, center, fillColor, fillOpacity) {
        var bdary = new BMap.Boundary(); //此类表示一个行政区域的边界。
        //返回行政区域的边界。 name: 查询省、直辖市、地级市、或县的名称。 callback:执行查询后，数据返回到客户端的回调函数
        bdary.get(name, function (rs) { //获取行政区域 
            // map.clearOverlays(); //清除地图覆盖物       
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {
                    strokeWeight: 2,
                    strokeOpacity: 0.8,
                    StrokeStyle: "solid",
                    strokeColor: "#1abc9c",
                    fillColor: fillColor,
                    fillOpacity: fillOpacity
                }); //建立多边形覆盖物
                map.addOverlay(ply); //添加覆盖物
                pointArray = pointArray.concat(ply.getPath()); //返回多边型的点数组
            }
            //根据提供的地理区域或坐标设置地图视野，调整后的视野会保证包含提供的地理区域或坐标
            map.setViewport(pointArray); //调整视野  
            map.centerAndZoom(center); //设置地图中心点
            // map.setZoom(13); //将视图切换到指定的缩放等级，中心点坐标不变。
        });
    }

    //function:遍历数据，渲染标注点:参数1:数据;参数2：数据内嵌套的分站数据数组名（即二维数组名）
    function renderPoint(data, stationDataName) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i][stationDataName].length; j++) {
                var point = new BMap.Point(data[i][stationDataName][j].X坐标, data[i][stationDataName][j].Y坐标); //创建标注点
                // 自定义信息窗口标题
                // opts.title = data_info[i].title;
                var marker = new BMap.Marker(point); // 创建标注
                // marker.setTop(true);//将标注置于其他标注之上
                // marker.setZIndex(999);
                map.addOverlay(marker); //向地图中添加标注点
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //给标注点添加跳动的动画
                // 设置标注点信息窗口的内容
                var content = setInfoWindowContent(data[i][stationDataName][j]);
                //添加标注点点击事件处理函数
                addClickHandler(content, marker);
            }
        }
    };
    //function:根据传入配置项对象来设置信息窗口的内容
    function setInfoWindowContent(obj) {
        var content = '<h4 style= "font-size:18px;line-height:24px;margin-bottom:5px;color:blue">' +
            obj.name + '</h4><p style="line-height:22px">' +
            '联系电话：' + obj.phone + '<br/>' +
            '坐标：' + obj.X坐标 + ',' + obj.Y坐标;
        return content;

    }

    //function:地图标注点的点击事件处理函数。参数1：信息窗口内容
    function addClickHandler(content, marker) {
        marker.addEventListener("click", function (e) {
            openInfo(content, e) //点击标注点打开信息窗口
        });
    }

    //function:打开信息窗口        
    function openInfo(content, e) {
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat); //获取点击事件对象的经纬度坐标创建地理点坐标
        var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    }

    // function:右侧地图信息块 列表渲染分中心列表。参数data：远程数据---格式类似本地模拟测试数据data_info
    function renderCenterList(data) {
        for (var i = 0; i < data.length; i++) {
            var centerItemStr = '<li class="centerItem">' +
                '<a href="javascript:;" class="centerLink">' +
                '<i class="centerIcon" style="background-image:url(images/center.png)"></i>' +
                '<span class="centerName">' + data[i].name + '</span>' +
                '<i class="arrow" style="background-image:url(images/arrow_up.png)"></i>' +
                '</a></li>';
            var stationListStr = '<ul class="stationList"></ul>';
            var centerItemObj = $(centerItemStr); //new centerItemObj（li）---动态创建分中心列表项
            var stationListObj = $(stationListStr); //new stationListObj（ul）--创建分中心列表项下的分站列表
            //列表渲染分站列表项
            renderStationList(data_info[i].stationList, stationListObj)
            //插入到DOM中
            centerItemObj.append(stationListObj);
            $(".centerList").append(centerItemObj);
            // renderStationList(data_info[i].stationList);
        }

    }
    // function:右侧地图信息块 列表渲染分站列表并给每一个分站注册点击事件。参数1：分站数据数组;参数2：分站列表项将插入的父节点
    function renderStationList(data, obj) {
        for (var i = 0; i < data.length; i++) {
            var stationItemstr = '<li class="stationItem"> ' +
                '<span class="icon" style="background-image:url(images/marker.png)"></span>' +
                '<div class="txt">' +
                '<a href="javascript:void(0)" title="' + data[i].name + '" class="aLink">' + data[i].name +
                '</a><p class="info" data-x="' + data[i].X坐标 + '" data-y="' + data[i].Y坐标 + '"data-content="' +
                data[i].content +
                '">地址：' +
                data[i].content + '<br>电话：' + data[i].phone + '<br>坐标：' + data[i].X坐标 + ',' + data[i].Y坐标 +
                '</p></div></li>';
            var stationItemObj = $(stationItemstr);
            obj.append(stationItemObj);
            //将右侧每个分站的信息窗内容存到li元素的自定义属性上，方便点击事件时获取对应的内容
            content = setInfoWindowContent(data[i]); //调用setInfoWindowContent（）函数，设置信息窗口内容，并存到分站列表项的自定义属性上。
            stationItemObj.attr("data-content", content);
        }

    }

    //function: 右侧地图信息块 分中心列表项下分站列表的折叠展开
    function centerItemClickHandler() {
        $(this).siblings(".stationList").toggle("normal", function () {
            // 箭头icon的对应切换
            if ($(this).css("display") == "none") {
                $(this).siblings(".centerLink").find(".arrow").css("backgroundImage", "url(images/arrow.png)");
            } else if ($(this).css("display") == "block") {
                $(this).siblings(".centerLink").find(".arrow").css("backgroundImage", "url(images/arrow_up.png)");
            }
        });
    }

    //function:分站列表项的点击事件处理函数---左侧上对应标注点信息窗口触发
    function stationItemClickHandler() {
        //2019-03-11 plq 当前点击项背景色突出显示--添加active预定义类样式
        $(".stationItem").removeClass("active");
        $(this).addClass("active");

        //获取存在自定义属性上的信息窗口内容及经纬度坐标
        var content = $(this).attr("data-content");
        var x = $(this).find("p").attr("data-x");
        var y = $(this).find("p").attr("data-y");
        var point = new BMap.Point(x, y); //创建地理点坐标
        // 将地图的中心点更改为给定的点。
        map.panTo(point);
        var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
        //打开信息窗
        map.openInfoWindow(infoWindow, point);

        //2018-02-02 当用户点击信息窗口的关闭按钮时，关闭站点计时的切换触发点击事件效果---清除计时器事件
        infoWindow.addEventListener("clickclose", function () {
            clearInterval(timeId);
            //同时清除左侧对应站点突出显示的背景色 
            $(".stationItem").removeClass("active");
        });
    }

    //2019-03-11 function：获取当前触发点击事件(.active类)的分站列表项在所有分站列表项中的索引
    function getActiveClassIndex() {
        var liObjs = $(".stationItem");
        var flag = false; //active类是否存在标识符
        var activeIndex;
        for (var i = 0; i < liObjs.length; i++) {
            if ($(liObjs[i]).hasClass("active")) {
                flag = true;
                activeIndex = (i >= liObjs.length - 1) ? 0 : i + 1;
            }
        }
        if (!flag) { //如果当前没有active类，默认从第一个列表项开始轮换触发点击事件
            activeIndex = 0;
        }
        return activeIndex;
    }

});
