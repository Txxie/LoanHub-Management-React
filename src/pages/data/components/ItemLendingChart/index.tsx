import React, { useState, useEffect } from 'react';
import echarts from 'echarts'
import { Button } from 'antd';
import { LendingChartType } from "@/types";

function transformData(data: any[]) {
    return data.map((item: { quantity: any; categoryName: any; }) => ({
        value: item.quantity,
        name: item.categoryName,
    }));
}

const ItemLendingChart: React.FC<LendingChartType> = ({ itemLendingData }) => {
    const [chartType, setChartType] = useState('bar'); // 默认为柱状图
    const [myChart, setMyChart] = useState(null);


    useEffect(() => {
        const itemLendingChartElement = document.getElementById('itemLendingChart');
        if (!myChart) {
            // 初始化 Echarts 实例
            const chart = echarts.init(document.getElementById('itemLendingChart'));
            setMyChart(chart);
            // 渲染图表
            renderChart(chart, itemLendingData, chartType);
        } else {
            // 更新图表
            renderChart(myChart, itemLendingData, chartType);
        }
    }, [itemLendingData, chartType, myChart]);

    // 渲染图表
    const renderChart = (chart: echarts.ECharts, data: any[], type: string) => {
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                type: 'category',
                data: itemLendingData?.map((item: { itemName: any; }) => item.itemName)
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: itemLendingData?.map((item: { count: any; }) => item.count),
                    type: type,
                    itemStyle: {
                        normal: {
                            color: '#105dbc' // 设置颜色为蓝色
                        }
                    }
                }
            ]
        };
        chart.clear();
        chart.setOption(option);
    };

    // 切换图表类型
    const toggleChartType = () => {
        setChartType(chartType === 'bar' ? 'line' : 'bar');
    };

    return (
        <div>
            <Button onClick={toggleChartType}>切换为{chartType === 'bar' ? '折线图' : '柱状图'}</Button>
            <div id="itemLendingChart" style={{ width: '85%', height: '450px' }}></div>
        </div>
    );
};

export default ItemLendingChart;