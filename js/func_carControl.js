/* function封装js文件，供C#后台调用 */
/* 车组运行质控页代码-- */

function renderPage(data) {
    alert(data);
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
    }, 3000);
}


/* function:获取x坐标轴数据项数据;参数：传入的data数据 */
function getxAxisData(data) {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
        arr.push(data[i].name);
    }
    return arr;
}

/* function:系列名转换 */
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

/* function:获取图例数据 */
function getLegendData(seriesNamesArr) {
    var arr = [];
    for (var i = 0; i < seriesNamesArr.length; i++) {
        arr.push(getSeriesName(seriesNamesArr[i]));
    }
    return arr;
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