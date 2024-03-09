import React, { useState, useEffect } from 'react';
import echarts from 'echarts'
import { Button } from 'antd';
import { DurationChartType } from "@/types";

const ItemDurationChart: React.FC<DurationChartType> = ({ itemDurationData }) => {

    const [myChart, setMyChart] = useState(null);


    useEffect(() => {
        if (!myChart) {
            // 初始化 Echarts 实例
            const chart = echarts.init(document.getElementById('itemDurationChart'));
            setMyChart(chart);
            // 渲染图表
            renderChart(chart, itemDurationData);
        } else {
            // 更新图表
            renderChart(myChart, itemDurationData);
        }
    }, [itemDurationData, myChart]);

    // 渲染图表
    const renderChart = (chart: echarts.ECharts, data: any[]) => {
        const option = {
            title: {
                text: '物品平均借用时长（单位：/h）'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },

            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLabel: {
                    formatter: '{value}h'  // 设置横坐标的单位为h
                }
            },
            yAxis: {
                // type: 'category',
                data: data?.map(item => item.itemName)
            },
            series: [
                {
                    // name: '2011',
                    type: 'bar',
                    data: data?.map(item => item.time),
                    itemStyle: {
                        normal: {
                            color: '#105dbc' // 设置颜色为蓝色
                        }
                    }
                },
                // {
                //   name: '2012',
                //   type: 'bar',
                //   data: [19325, 23438, 31000, 121594, 134141, 681807]
                // }
            ]
        };
        chart.clear();
        chart.setOption(option);
    };

    return (
        <div>
            <div id="itemDurationChart" style={{ width: '85%', height: '450px' }}></div>
        </div>
    );
};

export default ItemDurationChart;