/* function封装js文件，供C#后台调用 */
// 入口函数：
$(function(){
    

});

/* ****************************************************************** */
// 组织结构 展示页--//欠缺数据处理，将传进来的数据处理成echarts树状图所需的data---格式参考flare.json
function renderTreeChart(data){
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
            data:[data] //数据处理，将传进来的数据处理成echarts树状图所需的data格式---格式参考flare.json
            // data: [{
            //     name: '董事会',
            //     value: 6, // value 值，只在 tooltip 中显示
            //     children: [{
            //         name: '总经理',
            //         value: 6,
            //         children: [{
            //                 name: '营销中心',
            //                 value: 4,
            //                 children: [{
            //                         name: '市场部',
            //                         value: 4,
            //                     },
            //                     {
            //                         name: '销售部',
            //                         value: 4,
            //                     },
            //                     {
            //                         name: '客服部',
            //                         value: 4,
            //                     }
            //                 ]
            //             },
            //             {
            //                 name: '项目中心',
            //                 value: 4,
            //                 children: [{
            //                         name: '售前支持部',
            //                         value: 4,
            //                     },
            //                     {
            //                         name: '项目一部',
            //                         value: 4,
            //                     },
            //                     {
            //                         name: '项目二部',
            //                         value: 4,
            //                     },
            //                     {
            //                         name: '项目三部',
            //                         value: 4,
            //                     }
            //                 ]
            //             },
            //             {
            //                 name: '技术中心',
            //                 value: 4,
            //                 children: [{
            //                         name: '开发部',
            //                         value: 4,
            //                     },
            //                     {
            //                         name: '设计部',
            //                         value: 4,
            //                     },
            //                     {
            //                         name: '系统部',
            //                         value: 4,
            //                     }
            //                 ]
            //             },
            //             {
            //                 name: '行政部',
            //                 value: 4,
            //             },
            //             {
            //                 name: '财务部',
            //                 value: 4,
            //             },
            //         ]
            //     }]
            // }]
        }]
    };
    // option.series.data.name=data.name;
    // 为echarts对象加载数据 
    myChart.setOption(option);
}

/* ****************************************************************** */
// 组织结构 展示页--//欠缺数据处理，将传进来的数据处理成echarts树状图所需的data---格式参考flare.json

