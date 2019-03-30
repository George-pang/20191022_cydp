/* 本地页面调试js文件 */
/* version 1.0.0本地调用外部js文件---version2.0.0js代码移植入了每个单独的页面内，且添加了页面多次优化的代码 */
$(function () {
    //页面窗口改变刷新页面
    $(window).on("resize", function () {
        location.reload();
    });

    var timeData = {
        "startTime": "2019年02月01日 08:00",
        "endTime": "2019年03月01日 08:00"
    };
    setTimeRange(timeData); //设置标题栏时间范围

    //标题栏时间范围---自定义
    function setTimeRange(data) {
        $(".start_time").html(data.startTime);
        $(".end_time").html(data.endTime);
    }

    /* ****************************************************************************** */
    /* 1、组织结构 展示页 */
    (function () {
        if ($("#treeContainer").length != 0) {
            var dom = document.getElementById("treeContainer");
            var myChart = echarts.init(dom);
            // myChart.showLoading(); //显示加载样式
            $.get("/data/tree.json", function (data) {
                option = {
                    // title: {
                    //     text: '朝阳120组织结构图',
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}"
                    },
                    calculable: false,
                    series: [{
                        name: '树图',
                        type: 'tree',
                        orient: 'vertical', // vertical horizontal
                        rootLocation: {
                            x: 'center',
                            y: 120
                        }, // 根节点位置  {x: 'center',y: 10}
                        layerPadding: 100, //父子节点间连接线的长度
                        nodePadding: 20, //同级节点间的间隔
                        symbol: 'emptyRectangle',
                        symbolSize: [100, 50], //标记大小
                        itemStyle: { //图形样式
                            normal: {
                                // color: '#258b09', //颜色，主色
                                color: '#5989fc',
                                label: {
                                    show: true,
                                    position: 'inside',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 20,
                                        fontWeight: 'bolder',
                                        //e2版本里貌似给文字设置下列属性无效？？？
                                        // padding: 10,
                                        // borderRadius: 5,
                                        // backgroundColor: '#258b09',
                                    }
                                },
                                lineStyle: {
                                    // color: '#258b09',//连接线的颜色
                                    color: '#5989fc',
                                    width: 1,
                                    type: 'broken' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    position: 'inside',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 20,
                                        fontWeight: 'bolder',

                                    }
                                }
                            }
                        },
                        data: [data],
                    }]
                };
                myChart.setOption(option);
            });




        }

    }());

    /* ****************************************************************************** */
    /* 2、站点布局 展示页 */
    (function () {
        if ($(".site_main").length != 0) {
            // 本地模拟数据--二维对象数组嵌套
            var data_info = [{
                    name: "朝阳中心",
                    stationList: [{
                        "x": 116.456937,
                        "y": 39.93331,
                        "name": "朝阳中心1分站",
                        "address": "这是朝阳中心第一分站",
                        "phone": 87789999,
                    }, {
                        "x": 116.4457321,
                        "y": 39.92469024,
                        "name": "朝阳中心2分站",
                        "address": "这是朝阳中心第二分站",
                        "phone": 87789999,
                    }]
                },
                {
                    name: "垂杨柳分中心",
                    stationList: [{
                        "x": 116.451992,
                        "y": 39.932234,
                        "name": "垂杨柳中心1分站",
                        "address": "这是垂杨柳中心第一分站",
                        "phone": 87789999,
                    }, {
                        "x": 116.481685,
                        "y": 39.938963,
                        "name": "垂杨柳中心2分站",
                        "address": "这是垂杨柳中心第二分站",
                        "phone": 87789999,
                    }]
                }
            ];
            //信息窗口通用配置项
            var opts = {
                width: 0, // 信息窗口宽度
                height: 0, // 信息窗口高度
                offset: new BMap.Size(0, -10), //信息窗位置偏移值
                // title: data_info[i].title, // 信息窗口标题
                enableMessage: true //设置允许信息窗发送短息
            };

            //创建地图实例--在指定id的DOM容器内创建
            var map = new BMap.Map("mapContainer");
            mapInit(); //初始化地图
            // getBoundary(map,"北京市","北京市朝阳区","#fff",1); //显示朝阳区行政版块覆盖物
            getBoundary(map, "北京市朝阳区", "北京市朝阳区", "#0c88e8", 0.3); //显示朝阳区行政版块覆盖物
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
            }, 10000);


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
                        var point = new BMap.Point(data[i][stationDataName][j].x, data[i][stationDataName][j].y); //创建标注点
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
                var content = '<h4 style= "font-size:18px;line-height:24px;margin-bottom:5px;color:#0c88e8">' +
                    obj.name + '</h4><p style="line-height:22px">' +
                    '联系电话：' + obj.phone + '<br/>' +
                    '坐标：' + obj.x + ',' + obj.y;
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
                        '</a><p class="info" data-x="' + data[i].x + '" data-y="' + data[i].y + '"data-address="' +
                        data[i].address +
                        '">地址：' +
                        data[i].address + '<br>电话：' + data[i].phone + '<br>坐标：' + data[i].x + ',' + data[i].y +
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



        }
    }());


    /* ****************************************************************************** */
    /* 3、突发事件统计 展示页 */
    (function () {
        if ($(".event_main").length != 0) {
            //渲染左侧echarts地图
            var dom = document.getElementById("mapChart");
            var myChart = echarts.init(dom);
            var normalLableFont = 18;
            var strongLableFont = 20;
            $.get('/data/map.json', function (geoJson) {
                echarts.registerMap('chaoyang', geoJson, {});
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}<br/>'
                    },
                    visualMap: { //自定义视觉映射
                        show: false,
                        min: 0,
                        max: 300,
                        text: ['High', 'Low'],
                        left: 'left',
                        realtime: false,
                        calculable: true,
                        inRange: {
                            color: ['#d94e5d', '#eac736', '#50a3ba']
                        }
                    },
                    series: [{
                        name: '朝阳120各分区突发事件统计',
                        type: 'map',
                        // top:100,
                        mapType: 'chaoyang',
                        aspectScale: 1, //地图长度比,默认0.75
                        label: { //图形上的文本标签---对应json数据上的多边形分区name值
                            normal: { //正常时的样式
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: normalLableFont,
                                }
                            },
                            emphasis: { //高亮时的样式设置
                                show: true,
                                textStyle: {
                                    color: 'red',
                                    fontSize:strongLableFont,
                                }
                            }
                        },
                        data: [
                            {
                                name: '北片', //只有与json数据上的多边形分区name值对应才可以显示颜色
                                value: 50, //value值对应颜色映射的取值
                                itemStyle:{ //该数据所在区域的多边形样式设置
                                    areaColor:'yellow',
                                }
                            },
                            {
                                name: '中北片',
                                value: 100
                            },
                            {
                                name: '中南片',
                                value: 180
                            },
                            {
                                name: '南片',
                                value: 220
                            },
                            {
                                name: '外区',
                                value: 270
                            },
                        ],
                        itemStyle: { //地图区域的多边形 图形样式。
                            borderColor: '#fff', //图形的描边颜色
                            borderWidth: 1,
                            borderType: 'dashed',

                        },
                        markPoint: { //默认情况下，标记会居中置放在数据对应的位置，
                            symbol: 'path://m 0,0 h 48 v 20 h -30 l -6,10 l -6,-10 h -6 z',
                            symbolSize: 20,
                            // symbolSize:(rawValue, params) => {   //回调函数实现每个数据图形大小不一样
                            //     params.symbolSize = rawValue*5;
                            //     return params.symbolSize
                            // },
                            itemStyle: { //全局标注样式
                                // normal: {
                                //     // color:'#70b218' //貌似标记的颜色只能统一设置一个。。。回调无效？？
                                // },
                                emphasis: {
                                    color: '#f16d02',
                                    borderColor: '#fff',
                                    borderWidth: 1
                                }
                            },
                            label: { //标注的文本。
                                normal: {
                                    show: true,
                                    position: 'top',
                                    distance: 0,
                                    offset: [0, 5],
                                    // formatter: function (d) { //文本 回调函数格式：(params: Object|Array) => string
                                    //     return d.name + "\n" + d.value + "起"
                                    // },
                                    formatter: '{styleA|{b}：}{styleB|{c}}' + '\t起',
                                    textStyle: {
                                        fontFamily: '微软雅黑',
                                        align: 'center',
                                        color: '#38a0ff',
                                        // backgroundColor:"31b573",
                                        padding: 4,
                                    },
                                    rich: {
                                        styleA: {
                                            fontSize: normalLableFont,
                                            color: "#38a0ff",
                                        },
                                        styleB: {
                                            fontSize: strongLableFont,
                                            color: "#fff",
                                            lineHeight: 30,
                                        },
                                    }
                                }
                            },
                            animation: true, //开启动画
                            data: [{
                                    name: "火灾",
                                    coord: [116.556937, 39.93331], //标注的坐标点
                                    value: 30,
                                    itemStyle: { //该标注的自定义样式---还可设置symbol自定义标记图形
                                        color: 'yellow'
                                    }
                                },
                                {
                                    name: "CO中毒",
                                    coord: [116.5625, 39.8823],
                                    value: 10
                                }
                            ],
                        },
                    }]
                };
                myChart.setOption(option);

            });

            // 渲染右侧柱状图
            // 模拟数据
            var totalData = [{
                "name": "火灾",
                "totalNum": 10,
            }, {
                "name": "CO中毒",
                "totalNum": 10,
            }, {
                "name": "溺水",
                "totalNum": 10,
            }, {
                "name": "公共安全事件",
                "totalNum": 10,
            }, {
                "name": "特殊事件",
                "totalNum": 10,
            }];
            var eventData = [{
                    "name": "A区",
                    "data": [{
                            "name": "火灾",
                            "num": 5
                        },
                        {
                            "name": "CO中毒",
                            "num": 3
                        },
                        {
                            "name": "溺水",
                            "num": 6
                        },
                        {
                            "name": "公共事件",
                            "num": 7
                        },
                        {
                            "name": "特殊事件",
                            "num": 2
                        }
                    ]
                },
                {
                    "name": "B区",
                    "data": [{
                            "name": "火灾",
                            "num": 5
                        },
                        {
                            "name": "CO中毒",
                            "num": 3
                        },
                        {
                            "name": "溺水",
                            "num": 6
                        },
                        {
                            "name": "公共安全事件",
                            "num": 7
                        },
                        {
                            "name": "特殊事件",
                            "num": 2
                        }
                    ]
                },
                {
                    "name": "C区",
                    "data": [{
                            "name": "火灾",
                            "num": 5
                        },
                        {
                            "name": "CO中毒",
                            "num": 3
                        },
                        {
                            "name": "溺水",
                            "num": 6
                        },
                        {
                            "name": "公共安全事件",
                            "num": 7
                        },
                        {
                            "name": "特殊事件",
                            "num": 2
                        }
                    ]
                },
                {
                    "name": "D区",
                    "data": [{
                            "name": "火灾",
                            "num": 5
                        },
                        {
                            "name": "CO中毒",
                            "num": 3
                        },
                        {
                            "name": "溺水",
                            "num": 6
                        },
                        {
                            "name": "公共安全事件",
                            "num": 7
                        },
                        {
                            "name": "特殊事件",
                            "num": 2
                        }
                    ]
                },
                {
                    "name": "E区",
                    "data": [{
                            "name": "火灾",
                            "num": 5
                        },
                        {
                            "name": "CO中毒",
                            "num": 3
                        },
                        {
                            "name": "溺水",
                            "num": 6
                        },
                        {
                            "name": "公共安全事件",
                            "num": 7
                        },
                        {
                            "name": "特殊事件",
                            "num": 2
                        }
                    ]
                }
            ];
            var colors = ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53']; // 系列颜色
            var dom = document.getElementById("eventBarChart");
            var eventBarChart = echarts.init(dom, 'vintage');

            option = {
                color: colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    left: '3%',
                    top: 10,
                    itemWidth: 15,
                    itemHeight: 15,
                    data: ['火灾', 'CO中毒', '溺水', '公共安全', '特殊事件'],
                    textStyle: {
                        fontSize: 20,
                        // color: 'rgba(0,0,0,.6)',
                        color: '#fff',
                        fontWeight: 'lighter',
                    },
                },
                grid: {
                    top: 100,
                    left: '0',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: ['A区', 'B区', 'C区', 'D区', 'E区'],
                    axisLine: { //轴线
                        lineStyle: {
                            color: '#fff',
                        }
                    },
                    axisTick: { //刻度线
                        show: false,
                        alignWithLabel: true
                    },
                    axisLabel: { //刻度标签
                        margin: 10, //标签与轴线的距离
                        fontSize: 24,
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name: '事件/起',
                    nameTextStyle: {
                        color: 'rgba(255,255,255,.6)',
                        fontSize: 24,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                        }
                    },
                    axisTick: { //刻度线
                        length: 10,
                        alignWithLabel: true
                    },
                    axisLabel: { //刻度标签
                        margin: 15, //标签与轴线的距离
                        fontSize: 24,
                    }
                }],
                backgroundColor: 'transparent',
                series: [{
                        name: '火灾',
                        type: 'bar',
                        // barWidth: '10%',
                        data: [3, 5, 2, 6, 7],
                        label: {
                            show: true,
                            position: 'top',
                            color: '#fff',
                            fontSize: 24,
                        }
                    },
                    {
                        name: 'CO中毒',
                        type: 'bar',
                        // barWidth: '10%',
                        data: [4, 1, 0, 0, 6],
                        label: {
                            show: true,
                            position: 'top',
                            color: '#fff',
                            fontSize: 24,
                        }
                    },
                    {
                        name: '溺水',
                        type: 'bar',
                        // barWidth: '10%',
                        data: [7, 9, 4, 6, 2],
                        label: {
                            show: true,
                            position: 'top',
                            color: '#fff',
                            fontSize: 24,
                        },
                        barGap: 0, //柱间距离,为柱子快递的百分比
                    },
                    {
                        name: '公共安全',
                        type: 'bar',
                        // barWidth: '10%',
                        data: [7, 9, 4, 6, 2],
                        label: {
                            show: true,
                            position: 'top',
                            color: '#fff',
                            fontSize: 24,
                        },
                        barGap: 0, //柱间距离,为柱子快递的百分比
                    },
                    {
                        name: '特殊事件',
                        type: 'bar',
                        // barWidth: '10%',
                        data: [7, 9, 4, 6, 2],
                        label: {
                            show: true,
                            position: 'top',
                            color: '#fff',
                            fontSize: 24,
                        },
                        barGap: 0, //柱间距离,为柱子快递的百分比
                    },
                ]
            };
            eventBarChart.setOption(option);

            renderLevelColor(colors);
            // function：右侧事件总数统计列表前icon背景色对应显示
            function renderLevelColor(colors) {
                for (var i = 0; i < $(".data_item").length; i++) {
                    $($(".data_item")[i]).find(".event_level").css("backgroundColor", colors[i]);
                }
            }







        }


    }());


    /* ****************************************************************************** */
    /* 4、当日无车原因及区域 展示页 */
    (function () {
        if ($(".noCar_main").length != 0) {

            /*  渲染左侧echarts地图 */
            var dom = document.getElementById("carMapChart");
            var myChart = echarts.init(dom);
            $.get('/data/map.json', function (geoJson) {
                echarts.registerMap('chaoyang', geoJson, {});
                var option = {
                    // title: {
                    //     text: '当日无车区域展示',
                    //     left: 'center',
                    //     top: 40,
                    //     textStyle: {
                    //         fontSize: 24,
                    //         color: '#fff',
                    //         fontWeight: 400,
                    //     }
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}<br/>'
                    },
                    // backgroundColor: '#8ba4d8b8',
                    visualMap: { //自定义视觉映射
                        show: false,
                        min: 0,
                        max: 300,
                        text: ['High', 'Low'],
                        left: 'left',
                        realtime: false,
                        calculable: true,
                        inRange: {
                            color: ['#d94e5d', '#eac736', '#50a3ba']
                        }
                    },
                    series: [{
                        name: '朝阳120各分区突发事件统计',
                        type: 'map',
                        mapType: 'chaoyang',
                        aspectScale: 1, //地图长宽比
                        label: { //图形上的文本标签---对应json数据上的多边形分区name值
                            normal: { //正常时的样式
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 18,
                                }
                            },
                            emphasis: { //高亮时的样式设置
                                show: true,
                                textStyle: {
                                    color: 'red',
                                    fontSize: 20,
                                }
                            }
                        },
                        data: [
                            {
                                name: '北片', //只有与json数据上的多边形分区name值对应才可以显示颜色
                                value: 50, //value值对应颜色映射的取值
                                itemStyle:{ //该数据所在区域的多边形样式设置
                                    areaColor:'yellow',
                                }
                            },
                            {
                                name: '中北片',
                                value: 100
                            },
                            {
                                name: '中南片',
                                value: 180
                            },
                            {
                                name: '南片',
                                value: 220
                            },
                            {
                                name: '外区',
                                value: 270
                            },
                        ],
                        itemStyle: { //地图区域的多边形 图形样式。
                            borderColor: '#fff', //图形的描边颜色
                            borderWidth: 1,
                            borderType: 'dashed',

                        },
                        markPoint: { //默认情况下，标记会居中置放在数据对应的位置，
                            symbol: 'pin', //钉子形
                            symbolSize: 100,
                            itemStyle: {
                                normal: {
                                    color: '#4b96ff'
                                }
                            },
                            label: { //标注的文本。
                                normal: {
                                    show: true,
                                    formatter: function (d) { //文本 回调函数格式：(params: Object|Array) => string
                                        return d.name + "\t" + d.value + "次"
                                    },
                                    textStyle: {
                                        fontSize: 18,
                                        fontFamily: '微软雅黑',
                                        color: '#fff'
                                    },
                                    position: 'inside',
                                }
                            },
                            data: [{
                                    name: "无车",
                                    coord: [116.556937, 39.93331], //标注的坐标点
                                    value: 20
                                },
                                // {
                                //     name: "通州区",
                                //     coord: [116.552471, 39.761261],
                                // }
                            ],
                        },
                    }]
                };
                myChart.setOption(option);

            });

            /* 渲染右侧echarts饼图 */
            // 模拟数据
            var data = [{
                    value: 10,
                    name: '全网无车'
                },
                {
                    value: 20,
                    name: '附近无车'
                },
                {
                    value: 30,
                    name: '无合适车'
                },
                {
                    value: 40,
                    name: '控制出车'
                },
                {
                    value: 50,
                    name: '用户要求'
                },
                {
                    value: 60,
                    name: '电话中断'
                },
                {
                    value: 70,
                    name: '其他原因'
                },
                {
                    value: 80,
                    name: '预约派车'
                },
                {
                    value: 90,
                    name: '医学指导'
                },
                {
                    value: 100,
                    name: '转999处理'
                },
            ];
            // 系列颜色
            var colors = ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53',
                '#eedd78', '#73a373', '#73b9bc', '#91ca8c', '#f49f42'
            ];
            var titleFontSize = 24;
            var labelFontSize = 18;
            var dom = document.getElementById("noCarPieChart");
            var noCarPieChart = echarts.init(dom, 'vintage'); //ECharts 实例

            option = {
                // title: {
                //     text: '当日无车原因分布',
                //     textStyle: {
                //         fontSize: titleFontSize,
                //         color: '#fff',
                //         fontWeight: 400,
                //     },
                //     left: 'center',
                //     top: 40,
                // },
                color: colors,
                legend: {
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '5%',
                    // width:'90%',
                    // padding:200,
                    data: getLegendData(data),
                    itemGap: 20,
                    formatter: function (name) {
                        var total = 0;
                        var target;
                        for (var i = 0, l = data.length; i < l; i++) {
                            total += data[i].value;
                            if (data[i].name == name) {
                                target = data[i].value;
                            }
                        }
                        var arr = [
                            '{a|' + ((target / total) * 100).toFixed(2) + '%}',
                            '{b|' + name + '}',
                        ]
                        // return name + ' ' + ((target/total)*100).toFixed(2) + '%';
                        return arr.join('\n')
                    },
                    textStyle: {
                        fontSize: labelFontSize,
                        color: '#fff',
                        rich: {
                            a: {
                                fontSize: 20,
                                verticalAlign: 'top',
                                align: 'center',
                                padding: [0, 0, 28, 0]
                            },
                            b: {
                                fontSize: 16,
                                align: 'center',
                                padding: [0, 10, 0, 0],
                                lineHeight: 25
                            }
                        }
                    },
                },
                grid: {
                    top: '25%',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)",
                    // position: function (point, params, dom, rect, size) {
                    //     // 固定在顶部
                    //     return [point[0], '10%'];
                    // }
                },
                backgroundColor: 'transparent',
                series: [{
                    name: '当日无车原因',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '40%'],
                    data: data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        color: '#fff',
                        fontSize: labelFontSize,
                    },
                    labelLine: {
                        // show:false,
                        lineStyle: {
                            // color:'#fff',
                        }
                    }
                }]
            };

            noCarPieChart.setOption(option);

            /* function: 解析data,获取其中的图例数组 */
            function getLegendData(data) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push(data[i].name);
                }
                return arr;
            }

            // 2019-03-12 plq 饼图扇区高亮自动切换
            var timeId;
            autoDispatchAction(noCarPieChart, option);

            //function: 主动触发echarts实例高亮行为，实现扇区高亮自动切换。参数1：echarts实例；参数2：option配置对象
            function autoDispatchAction(myChart, option) {
                var app = {
                    currentIndex: -1 //初始数据索引值---通过其指定高亮的某个数据
                };

                timeId = setInterval(function () {
                    var dataLen = option.series[0].data.length;
                    // 取消之前高亮的图形
                    myChart.dispatchAction({
                        type: 'downplay', //取消高亮指定的数据图形。
                        seriesIndex: 0, // 可选，系列 index
                        dataIndex: app.currentIndex // 可选，数据的 index
                    });
                    app.currentIndex = (app.currentIndex + 1) % dataLen;
                    // 高亮当前图形---通过seriesName或者seriesIndex指定系列。通过指定dataIndex或者name再指定某个数据。
                    myChart.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: app.currentIndex
                    });
                    // 显示 tooltip
                    myChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: app.currentIndex
                    });
                }, 3000);
            }


        }

    }());


    /* ****************************************************************************** */
    /* 5、车辆平均反应数据统计 展示页 */
    (function () {
        if ($(".response_main").length != 0) {

            /* 渲染左侧柱状图 */
            //本地模拟数据
            var data = [{
                    name: "朝阳",
                    avgTime: 150,
                    avgRadius: 12
                },
                {
                    name: "垂杨柳",
                    avgTime: 220,
                    avgRadius: 14
                },
                {
                    name: "东坝",
                    avgTime: 330,
                    avgRadius: 18
                },
                {
                    name: "双桥",
                    avgTime: 80,
                    avgRadius: 10
                },
                {
                    name: "亚运村",
                    avgTime: 360,
                    avgRadius: 8
                },
            ]
            var dom = document.getElementById("responseBarChart");
            var carChart = echarts.init(dom);
            var seriesColors = ['#5793f3', '#d14a61']; //系列色
            var barColors = ["#c23531", "#61a0a8", "#FFDE76", "#E43C59", "#37A2DA"]; //柱状图图柱色
            var axisLabelFontSize = 22;
            var option = {
                title: {
                    text: "朝阳120各中心救护车平均反应时间、半径统计",
                    textStyle: {
                        // color: '#fff',
                        color: '#00c0ff',
                        fontSize: 28,
                    },
                    left: 'center',
                    bottom: 50,
                },
                color: seriesColors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { //坐标轴指示器配置项
                        type: 'cross', //十字准星指示器
                        label: { //坐标轴指示器的文本标签。
                            fontSize: 18,
                            padding: [5, 10],
                            backgroundColor: '#d14a61'
                        }
                    }
                },
                grid: { //直角坐标系 grid
                    // top: 100,
                    top: '15%',
                    bottom: 200,
                    left: '20%',
                    right: '25%'
                },
                // legend: {
                //     data: ['平均反应时间', '平均反应半径']
                // },
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: getData(data, "name"),
                    axisLine: { //轴线
                        lineStyle: {
                            color: '#fff',
                        }
                    },
                    axisTick: { //刻度线
                        show: false,
                        alignWithLabel: true
                    },
                    axisLabel: { //刻度标签
                        interval: 0, //标签的显示间隔(类目轴中有效),设置成 0 强制显示所有标签
                        margin: 20, //标签与轴线的距离
                        fontSize: axisLabelFontSize,
                        rotate: 30,
                    }
                }],
                yAxis: [{
                        type: 'value',
                        name: '平均反应时间',
                        nameTextStyle: {
                            // color: 'rgba(255,255,255,.6)',
                            color: seriesColors[0],
                            fontSize: axisLabelFontSize,
                        },
                        nameGap: 30, //坐标轴名称与轴线之间的距离
                        min: 0,
                        // max: 400,
                        position: 'left',
                        axisLine: {
                            lineStyle: {
                                color: seriesColors[0]
                                // color: '#fff'

                            }
                        },
                        axisLabel: {
                            formatter: '{value} 秒',
                            margin: 15, //标签与轴线的距离
                            fontSize: axisLabelFontSize,
                        },
                        axisTick: { //刻度线
                            length: 10,
                            alignWithLabel: true
                        },
                        splitLine: {
                            show: false
                        }

                    },
                    {
                        type: 'value',
                        name: '平均反应半径',
                        nameTextStyle: {
                            // color: 'rgba(255,255,255,.6)',
                            color: seriesColors[1],
                            fontSize: axisLabelFontSize,
                        },
                        nameGap: 30,
                        min: 0,
                        // max: 20,
                        position: 'right',
                        offset: 80,
                        axisLine: { //轴线
                            lineStyle: {
                                color: seriesColors[1]
                                // color: '#fff'
                            }
                        },
                        axisLabel: { //刻度标签文本
                            formatter: '{value} km',
                            margin: 15, //标签与轴线的距离
                            fontSize: axisLabelFontSize,
                        },
                        axisTick: { //刻度线
                            length: 10,
                            alignWithLabel: true
                        },
                        splitLine: { //分割线
                            show: false
                        }
                    },
                ],
                series: [{
                        name: '平均反应时间',
                        type: 'bar',
                        data: getData(data, "avgTime"),
                        barWidth: '50%', //柱条的宽度，不设时自适应。支持设置成相对于类目宽度的百分比。
                        /* 每根柱子不同颜色设置 */
                        itemStyle: {
                            normal: {
                                //params:Object;传入的是数据项 seriesIndex, dataIndex, data, value 等各个参数。
                                color: function (params) {
                                    let colorList = barColors;
                                    return colorList[params.dataIndex];
                                }
                            }
                        },
                    },
                    {
                        name: '平均反应半径',
                        type: 'line',
                        yAxisIndex: 1,
                        data: getData(data, "avgRadius"),
                        itemStyle: {
                            normal: {
                                color: seriesColors[1]
                            }
                        }
                    }
                ]
            };
            carChart.setOption(option);

            //function: 解析格式类似对象数组的数据，获取其中对象某个key名对应的数据数组
            function getData(data, key) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push(data[i][key]);
                }
                return arr;
            }

        }

    }());


    /* ****************************************************************************** */
    /* 6、朝阳120车组运行质控 展示页 */
    (function () {
        if ($(".car_main").length != 0) {
            // 模拟数据
            var data = [{
                    name: 'a车',
                    value: {
                        overTime_2: 15,
                        overTime_90: 13,
                        taskNum: 20,
                        peopleNum: 25,
                    }

                },
                {
                    name: 'A车',
                    value: {
                        overTime_2: 15,
                        overTime_90: 13,
                        taskNum: 20,
                        peopleNum: 25,
                    }
                },
                {
                    name: 'A车',
                    value: {
                        overTime_2: 15,
                        overTime_90: 13,
                        taskNum: 20,
                        peopleNum: 25,
                    }
                },
                {
                    name: 'A车',
                    value: {
                        overTime_2: 15,
                        overTime_90: 13,
                        taskNum: 20,
                        peopleNum: 25,
                    }
                },
                {
                    name: 'A车',
                    value: {
                        overTime_2: 15,
                        overTime_90: 13,
                        taskNum: 20,
                        peopleNum: 25,
                    },
                },
                {
                    name: 'A车',
                    value: {
                        overTime_2: 15,
                        overTime_90: 13,
                        taskNum: 20,
                        peopleNum: 25,
                    }
                },
                {
                    name: 'A车',
                    value: {
                        overTime_2: 15,
                        overTime_90: 13,
                        taskNum: 20,
                        peopleNum: 25,
                    }
                },
                {
                    name: 'A车',
                    value: {
                        overTime_2: 15,
                        overTime_90: 13,
                        taskNum: 20,
                        peopleNum: 25,
                    }
                },
                {
                    name: 'A车',
                    value: {
                        overTime_2: 15,
                        overTime_90: 13,
                        taskNum: 20,
                        peopleNum: 25,
                    }
                },
                {
                    name: 'd车',
                    value: {
                        overTime_2: 15,
                        overTime_90: 13,
                        taskNum: 20,
                        peopleNum: 25,
                    }
                },
            ];
            var seriesNames_en = ["overTime_2", "overTime_90", "taskNum", "peopleNum"]; //图例英文名

            // 系列颜色
            // var colors = ['#09508b', '#da7f1c', '#258b09', '#cd3213'];
            var colors = ["#00cccc", "#40ca62", "#0099ff", "#f7bd05"];
            var titleFontSize = 24;
            var labelFontSize = 18;
            var dom = document.getElementById("carBarChart");
            var carBarChart = echarts.init(dom, 'vintage');
            var showValue = 5; //dataZoom数据窗口显示个数

            option = {
                // title: {
                //     text: '车组运行质控统计',
                //     textStyle: {
                //         fontSize: titleFontSize,
                //         color: '#00c0ff',
                //         fontWeight:'bold',
                //     },
                //     left: '5%',
                //     top: 30,
                // },
                color: colors,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    left: 'center',
                    top: '10%',
                    itemHeight: 15,
                    data: getLegendData(seriesNames_en),
                    textStyle: {
                        fontSize: 20,
                        color: '#fff',
                        fontWeight: 'lighter',
                    },
                },
                grid: {
                    top: '25%',
                    left: '10%',
                    right: '10%',
                    bottom: '10%',
                    containLabel: true
                },
                dataZoom: [{ //dataZoom 组件 用于区域缩放
                    type: 'inside',
                    startValue: 0,
                    endValue: showValue - 1, //如果轴的类型为 category，则 endValue 即可以设置为 axis.data 数组的 index
                    // handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    // handleSize: '80%',
                    // handleStyle: {
                    //     color: '#fff',
                    //     shadowBlur: 3,
                    //     shadowColor: 'rgba(0, 0, 0, 0.6)',
                    //     shadowOffsetX: 2,
                    //     shadowOffsetY: 2
                    // }
                }],
                xAxis: [{
                    type: 'category',
                    data: getxAxisData(data),
                    axisLine: { //轴线
                        lineStyle: {
                            color: '#fff',
                        }
                    },
                    axisTick: { //刻度线
                        show: false,
                        alignWithLabel: true
                    },
                    axisLabel: { //刻度标签
                        margin: 10, //标签与轴线的距离
                        fontSize: 24,
                    }
                }],
                yAxis: [{
                    type: 'value',
                    // name: '(次/人)',
                    // nameTextStyle: {
                    //     color: 'rgba(255,255,255,.6)',
                    //     fontSize: 24,
                    // },
                    axisLine: { //坐标轴
                        lineStyle: {
                            color: '#fff',
                        }
                    },
                    axisTick: { //刻度线
                        length: 10,
                        alignWithLabel: true
                    },
                    axisLabel: { //刻度标签
                        margin: 15, //标签与轴线的距离
                        fontSize: 24,
                    },
                    splitLine: { //是否显示分隔线（网格线）。默认数值轴显示，类目轴不显示。
                        show: false
                    }

                }],
                backgroundColor: 'transparent',
                series: getSeries(data, seriesNames_en),
            };
            carBarChart.setOption(option);
            //自动切换平移数据窗口
            setInterval(function () {
                var totalValue = getxAxisData(data).length - 1;
                // console.log(totalValue);
                option.dataZoom[0].startValue += 1;
                option.dataZoom[0].endValue += 1;
                // console.log(option.dataZoom[0].endValue);
                carBarChart.setOption(option);
                if (option.dataZoom[0].endValue == totalValue) {
                    option.dataZoom[0].startValue = 0 - 1;
                    option.dataZoom[0].endValue = showValue - 1 - 1;
                }
            }, 10000);

            /* function:获取图例数据 */
            function getLegendData(seriesNamesArr) {
                var arr = [];
                for (var i = 0; i < seriesNamesArr.length; i++) {
                    arr.push(getSeriesName(seriesNamesArr[i]));
                }
                return arr;
            }

            /* function:获取x坐标轴类目名数据;参数：传入的data数据 */
            function getxAxisData(data) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    arr.push(data[i].name);
                }
                return arr;
            }

            /* function:系列名转换  英文--中文 */
            function getSeriesName(name) {
                var str;
                switch (name) {
                    case "overTime_2":
                        str = "2分钟超时数"
                        break;
                    case "overTime_90":
                        str = "90分钟超时数"
                        break;
                    case "taskNum":
                        str = "任务数"
                        break;
                    case "peopleNum":
                        str = "救治人数"
                        break;
                    default:
                        break;
                }
                return str;
            }

            /* function：获取对应的系列数据;参数1:预声明的变量data,参数2:系列名  */
            function getSeriesData(data, seriesName) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    // console.log(seriesName);
                    // console.log(data[i].value)
                    // console.log(data[i].value[seriesName]);
                    arr.push(data[i].value[seriesName]);
                }
                return arr;
            }

            /* function：获取所有系列数据;参数1:预声明的变量data,参数2:系列名数组  */
            function getSeries(data, seriesNamesArr) {
                var series = [];
                for (var i = 0; i < seriesNamesArr.length; i++) {
                    var obj = {};
                    obj.name = getSeriesName(seriesNamesArr[i]);
                    obj.type = 'bar',
                        obj.data = getSeriesData(data, seriesNamesArr[i]);
                    obj.label = {
                        show: true,
                        position: 'top',
                        color: '#fff',
                        fontSize: 24,
                    };
                    if (i == seriesNamesArr.length - 1) {
                        obj.barGap = 0;
                    }
                    series.push(obj);
                }
                // console.log(series);
                return series;

            }

        }

    }());



});