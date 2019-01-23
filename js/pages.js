/* 本地页面调试js文件 */
$(function () {

    /* ****************************************************************************** */
    /* 1、组织结构 展示页 */
    (function () {
        if ($("#treeContainer").length != 0) {

            var dom = document.getElementById("treeContainer");
            var myChart = echarts.init(dom);
            // myChart.showLoading(); //显示加载样式
            var option = {
                tooltip: {
                    show: true,
                    trigger: 'item',
                    formatter: "{b}: {c}"
                },
                series: [{
                    name: '树图',
                    type: 'tree',
                    layout: 'orthogonal',
                    orient: 'LR', //从左到右，从右到左；从上到下，从下到上,取值分别为 'LR' , 'RL', 'TB', 'BT'
                    top: '5%', //tree组件离容器上侧的距离。
                    bottom: '5%',
                    // left:'5%',
                    // right:'5%',
                    symbol: 'rect', //设置节点标记的图形
                    symbolSize: [100, 50], //标记图形的长宽
                    expandAndCollapse: false, //是否打开子树折叠和展开的交互
                    initialTreeDepth: 3,
                    itemStyle: { //节点样式
                        color: 'transparent', //节点填充色--区分折叠还是展开
                        borderColor: "#c23531", //图形的描边颜色
                        borderWidth: 0, //描边线宽。为 0 时无描边。
                    },
                    label: { //文本标签样式
                        show: true,
                        position: 'inside', //标签的位置:位于图形标记盒内部
                        color: '#fff', //文字颜色\
                        fontSize: 24,
                        // height:50,
                        backgroundColor: '#258b09', //文字块背景色
                        borderRadius: 3,
                        formatter: '{b|{b}}', //{b}数据名
                        rich: {
                            b: {
                                color: '#fff',
                                padding: 10,
                                borderRadius: 5,
                                backgroundColor: '#258b09',
                                fontSize: 24,
                                // height:50,
                                // lineHeight: 50,
                            },

                        },
                    },
                    lineStyle: {
                        color: '#fff',
                        width: 1,
                        curveness: 1,
                        type: 'solid' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                    },
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    data: [{
                        name: '董事会',
                        value: 6, // value 值，只在 tooltip 中显示
                        children: [{
                            name: '总经理',
                            value: 6,
                            children: [{
                                    name: '营销中心',
                                    value: 4,
                                    children: [{
                                            name: '市场部',
                                            value: 4,
                                        },
                                        {
                                            name: '销售部',
                                            value: 4,
                                        },
                                        {
                                            name: '客服部',
                                            value: 4,
                                        }
                                    ]
                                },
                                {
                                    name: '项目中心',
                                    value: 4,
                                    children: [{
                                            name: '售前支持部',
                                            value: 4,
                                        },
                                        {
                                            name: '项目一部',
                                            value: 4,
                                        },
                                        {
                                            name: '项目二部',
                                            value: 4,
                                        },
                                        {
                                            name: '项目三部',
                                            value: 4,
                                        }
                                    ]
                                },
                                {
                                    name: '技术中心',
                                    value: 4,
                                    children: [{
                                            name: '开发部',
                                            value: 4,
                                        },
                                        {
                                            name: '设计部',
                                            value: 4,
                                        },
                                        {
                                            name: '系统部',
                                            value: 4,
                                        }
                                    ]
                                },
                                {
                                    name: '行政部',
                                    value: 4,
                                },
                                {
                                    name: '财务部',
                                    value: 4,
                                },
                            ]
                        }]
                    }]
                }]
            };
            // 为echarts对象加载数据 
            myChart.setOption(option);

        }

    }());

    /* ****************************************************************************** */
    /* 2、站点布局 展示页 */
    (function () {
        if ($(".site_main").length != 0) {
            // 本地模拟数据
            var data_info = [{
                "X坐标": 116.456937,
                "Y坐标": 39.93331,
                "title": "朝阳1分站",
                "content": "这是朝阳120第一分站",
                "phone": 87789999,
            }, {
                "X坐标": 116.4457321,
                "Y坐标": 39.92469024,
                "title": "朝阳2分站",
                "content": "这是朝阳120第二分站",
                "phone": 87789999,
            }, {
                "X坐标": 116.451992,
                "Y坐标": 39.932234,
                "title": "朝阳3分站",
                "content": "这是朝阳120第三分站",
                "phone": 87789999
            }, {
                "X坐标": 116.481685,
                "Y坐标": 39.938963,
                "title": "朝阳4分站",
                "content": "这是朝阳120第四分站",
                "phone": 87789999
            }];
            //信息窗口通用配置项
            var opts = {
                width: 0, // 信息窗口宽度
                height: 0, // 信息窗口高度
                offset: new BMap.Size(0, -10), //信息窗位置偏移值
                // title: data_info[i].title, // 信息窗口标题
                enableMessage: true //设置允许信息窗发送短息
            };
            //创建地图实例
            var map = new BMap.Map("mapContainer");
            mapInit();
            // getBoundary();

            //创建多个标注点并添加信息窗口
            for (var i = 0; i < data_info.length; i++) {
                var point = new BMap.Point(data_info[i].X坐标, data_info[i].Y坐标); //创建标注点
                // 自定义信息窗口标题
                // opts.title = data_info[i].title;
                var marker = new BMap.Marker(point); // 创建标注
                // var content = data_info[i].content;
                var content = '<h4 style= "font-size:18px;line-height:24px;margin-bottom:5px;color:blue">' +
                    data_info[i].title + '</h4><p style="line-height:22px">' +
                    '联系电话：' + data_info[i].phone + '<br/>' +
                    '坐标：' + data_info[i].X坐标 + ',' + data_info[i].Y坐标;
                map.addOverlay(marker);
                addClickHandler(content, marker);
            }
            //渲染右侧地图标注列表
            renderMarkerList(data_info);
            //注册点击事件
            $("#markerList").on("click", "li", liElementClickHandler);


            //function：初始化地图配置
            function mapInit() {
                map.centerAndZoom('北京市朝阳区', 15); //初始化地图中心点及缩放级别
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

            }

            //function:地图标注点点击处理函数
            function addClickHandler(content, marker) {
                marker.addEventListener("click", function (e) {
                    openInfo(content, e)
                });
            }
            //function:打开信息窗口        
            function openInfo(content, e) {
                var p = e.target;
                var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
                var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
                map.openInfoWindow(infoWindow, point); //开启信息窗口
            }
            // function:右侧地图信息列表渲染
            function renderMarkerList(data) {
                for (var i = 0; i < data.length; i++) {
                    str = '<li class="markerItem" id="no0"> ' +
                        '<span class="icon" id="mk_0" style="background-image:url(images/marker.png)"></span>' +
                        '<div id="no_0" class="txt">' +
                        '<a href="javascript:void(0)" title="' + data[i].title + '" class="aLink title">' + data[i].title +
                        '</a><p class="info" data-x="' + data[i].X坐标 + '" data-y="' + data[i].Y坐标 + '"data-content="' + data[i].content +
                        '">地址：' +
                        data[i].content + '<br>电话：' + data[i].phone + '<br>坐标：' + data[i].X坐标 + ',' + data[i].Y坐标 +
                        '</p></div></li>';
                    $("#markerList").append(str); //动态插入li标签
                }
            }

            function liElementClickHandler() {
                var x = $(this).find("p").attr("data-x");
                var y = $(this).find("p").attr("data-y");
                var point = new BMap.Point(x, y);
                // 将地图的中心点更改为给定的点。
                map.panTo(point);
                // var content = $(this).find("p").attr("data-content");
                var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
                //打开信息窗
                map.openInfoWindow(infoWindow, point);
            }
            //function:在地图上显示行政区域划分
            function getBoundary() {
                var bdary = new BMap.Boundary(); //此类表示一个行政区域的边界。
                //返回行政区域的边界。 name: 查询省、直辖市、地级市、或县的名称。 callback:执行查询后，数据返回到客户端的回调函数
                bdary.get("北京市朝阳区", function (rs) { //获取行政区域 
                    map.clearOverlays(); //清除地图覆盖物       
                    var count = rs.boundaries.length; //行政区域的点有多少个
                    if (count === 0) {
                        alert('未能获取当前输入行政区域');
                        return;
                    }
                    var pointArray = [];
                    for (var i = 0; i < count; i++) {
                        var ply = new BMap.Polygon(rs.boundaries[i], {
                            strokeWeight: 2,
                            strokeColor: "#ff0000",
                            fillColor: "#fff",
                            fillOpacity: 0
                        }); //建立多边形覆盖物
                        map.addOverlay(ply); //添加覆盖物
                        pointArray = pointArray.concat(ply.getPath()); //返回多边型的点数组
                    }
                    //根据提供的地理区域或坐标设置地图视野，调整后的视野会保证包含提供的地理区域或坐标
                    map.setViewport(pointArray); //调整视野  
                    // map.centerAndZoom('北京市朝阳区', 14);
                    map.setZoom(15); //将视图切换到指定的缩放等级，中心点坐标不变。
                });
            }
        }
    }());

    /* ****************************************************************************** */
    /* 3、突发事件统计 展示页 */
    (function () {
        if ($(".event_main").length != 0) {
            // 本地测试数据
            var data = [{
                    "area": "朝外街道",
                    "num": 10,
                    "x坐标": 116.489279,
                    "y坐标": 39.931144,
                    "event": "CO中毒"
                },
                {
                    "area": "建外街道",
                    "num": 12,
                    "x坐标": 116.451992,
                    "y坐标": 39.931144,
                    "event": "CO中毒"
                },
                {
                    "area": "三里屯街道",
                    "num": 13,
                    "x坐标": 116.489279,
                    "y坐标": 39.926078,
                    "event": "火灾"
                },
                {
                    "area": "潘家园街道",
                    "num": 14,
                    "x坐标": 116.460197,
                    "y坐标": 39.931144,
                    "event": "火灾"
                },
            ];
            // 百度地图API功能
            var mp = new BMap.Map("map_event");
            eventMapInit();
            setConstructorPrototype();
            addCompOverlay(data);

            //function:初始化地图配置
            function eventMapInit() {
                mp.centerAndZoom("北京市朝阳区", 15);
                mp.enableScrollWheelZoom();
            }
            //自定义构造函数: 复杂的自定义覆盖物
            function ComplexCustomOverlay(point, text, num, bgColor) {
                this._point = point;
                this._text = text;
                this._num = num;
                this._bgColor = bgColor;
                // this._overText = mouseoverText;
            }
            //指定自定义构造函数的原型对象并添加方法
            function setConstructorPrototype() {
                ComplexCustomOverlay.prototype = new BMap.Overlay();
                //初始化覆盖物，当调用map.addOverlay时，API将调用此方法。
                ComplexCustomOverlay.prototype.initialize = function (map) {
                    this._map = map;
                    var div = this._div = document.createElement("div");
                    div.style.position = "absolute";
                    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                    div.style.backgroundColor = this._bgColor;
                    // div.style.border = "1px solid #BC3B3A";
                    div.style.color = "white";
                    div.style.height = "25px";
                    div.style.padding = "0 15px";
                    div.style.lineHeight = "20px";
                    div.style.whiteSpace = "nowrap";
                    div.style.MozUserSelect = "none";
                    div.style.fontSize = "16px"
                    div.style.borderRadius = "4px";
                    div.style.boxShadow = "1px 2px 3px rgba(0,0,0,0.3)";
                    div.style.cursor = "pointer";
                    var span = this._span = document.createElement("span");
                    span.style.display = "inline-block";
                    span.style.height = "25px";
                    span.style.lineHeight = "25px";
                    div.appendChild(span);
                    span.appendChild(document.createTextNode(this._text + "\t" + this._num + "个"));
                    var that = this;

                    //倒三角箭头
                    var arrow = this._arrow = document.createElement("i");
                    arrow.style.zIndex = 2;
                    arrow.style.display = "block";
                    arrow.style.borderColor = "transparent transparent transparent transparent";
                    arrow.style.borderTopColor = that._bgColor;
                    arrow.style.width = 0;
                    arrow.style.height = 0;
                    arrow.style.lineHeight = 0;
                    arrow.style.fontSize = 0;
                    arrow.style.borderWidth = "8px";
                    arrow.style.borderStyle = "solid dashed dashed dashed";
                    arrow.style.position = "absolute";
                    arrow.style.top = "25px";
                    arrow.style.left = "50%";
                    arrow.style.transform = "translateX(-50%)";
                    arrow.style.opacity = .85;
                    div.appendChild(arrow);

                    //鼠标移入移出背景色改变
                    div.onmouseover = function () {
                        this.style.backgroundColor = "rgba(255,102,0,.85)";
                        this.getElementsByTagName("i")[0].style.borderColor = "#f60 transparent transparent transparent";
                        // arrow.style.backgroundPosition = "0px -20px";
                    }

                    div.onmouseout = function () {
                        console.log(that._bgColor);
                        this.style.backgroundColor = that._bgColor;

                        // arrow.style.backgroundPosition = "0px 0px";
                        this.getElementsByTagName("i")[0].style.borderTopColor = that._bgColor;
                    }
                    //getPanes()返回地图覆盖物容器列表,即MapPanes对象，其labelPane属性表示文本标注所在的容器
                    //   console.log(mp.getPanes());
                    mp.getPanes().labelPane.appendChild(div);

                    return div;
                }
                //抽象方法，当地图状态发生变化时，由系统调用对覆盖物进行绘制。自定义覆盖物需要实现此方法
                ComplexCustomOverlay.prototype.draw = function () {
                    var map = this._map;
                    //根据地理坐标获取对应的覆盖物容器的坐标，此方法用于自定义覆盖物
                    var pixel = map.pointToOverlayPixel(this._point);
                    // console.log(pixel); //{x: 450, y: 163}
                    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
                    this._div.style.top = pixel.y - 30 + "px";
                }
            }

            // function:根据对应事件类型选择对应的覆盖物主题色
            function getEventColor(event) {
                var color;
                switch (event) {
                    case "CO中毒":
                        color = "rgba(97,171,0,0.85)";
                        break;
                    case "火灾":
                        color = "red";
                        break;
                    default:
                        color = "#000"
                        break;
                }
                return color;
            }
            // function：遍历渲染添加自定义覆盖物
            function addCompOverlay(data) {
                for (var i = 0; i < data.length; i++) {
                    myCompOverlay = new ComplexCustomOverlay(new BMap.Point(data[i].x坐标, data[i].y坐标), data[i].area, data[i].num, getEventColor(data[i].event));
                    mp.addOverlay(myCompOverlay); //向地图中添加覆盖物
                }

            }







        }


    }());

















});