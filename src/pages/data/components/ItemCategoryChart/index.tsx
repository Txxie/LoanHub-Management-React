// 展示各个分类物品的数量分布，以饼状图或柱状图的形式呈现，方便用户了解不同分类物品的比例和分布情况。
import React, { useState, useEffect } from 'react';
import echarts from 'echarts'
import { Button } from 'antd';
import { CategoryChartType } from "@/types";

function transformData(data: any[]) {
    return data.map((item: { quantity: any; categoryName: any; }) => ({
        value: item.quantity,
        name: item.categoryName,
    }));
}

const ItemCategoryChart: React.FC<CategoryChartType> = ({ itemCategoryData }) => {
    const [chartType, setChartType] = useState('bar'); // 默认为柱状图
    const [myChart, setMyChart] = useState(null);


    useEffect(() => {
        const itemCategoryChartElement = document.getElementById('itemCategoryChart');
        if (!myChart) {
            // 初始化 Echarts 实例
            const chart = echarts.init(document.getElementById('itemCategoryChart'));
            setMyChart(chart);
            // 渲染图表
            renderChart(chart, itemCategoryData, chartType);
        } else {
            // 更新图表
            renderChart(myChart, itemCategoryData, chartType);
        }
    }, [itemCategoryData, chartType, myChart]);

    // 渲染图表
    const renderChart = (chart: echarts.ECharts, data: any[], type: string) => {
        const nightingaleOption = {
            title: {
                text: '南丁格尔玫瑰图',
                // subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                left: 'center',
                top: 'bottom',
                data: data?.map(item => item.categoryName)
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: 'Radius Mode',
                    type: 'pie',
                    radius: [20, 140],
                    center: ['25%', '50%'],
                    roseType: 'radius',
                    itemStyle: {
                        borderRadius: 5
                    },
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: true
                        }
                    },
                    data: transformData(data),
                },
                {
                    name: 'Area Mode',
                    type: 'pie',
                    radius: [20, 140],
                    center: ['75%', '50%'],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 5
                    },
                    data: transformData(data),
                }
            ]
        };
        const barOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: data?.map(item => item.categoryName),
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: data?.map(item => item.quantity),
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#105dbc' // 设置颜色为蓝色
                        }
                    }
                }
            ]
        }
        const option = type === 'bar' ? barOption : nightingaleOption;
        chart.clear();
        chart.setOption(option);
    };

    // 切换图表类型
    const toggleChartType = () => {
        setChartType(chartType === 'bar' ? 'pie' : 'bar');
    };

    return (
        <div>
            <Button onClick={toggleChartType}>切换图表类型</Button>
            <div id="itemCategoryChart" style={{ width: '85%', height: '450px' }}></div>
        </div>
    );
};

export default ItemCategoryChart;