// 物品借用时长统计
import React, { useState, useEffect } from 'react';
import Content from "@/components/Content";
import ItemDurationChart from "../components/ItemDurationChart";
import { borrowData } from "@/api";
import { time } from 'console';

// 定义接口来表示项目数据的类型
interface DurationDataType {
    itemName: string;
    time: number;
}

const fakeItemCategoryData = [
    {
        itemName: '文具1',
        time: 10,
    },
    {
        itemName: '文具2',
        time: 30,
    },
    {
        itemName: '文具3',
        time: 40,
    },
    {
        itemName: '文具4',
        time: 20,
    },
    {
        itemName: '文具5',
        time: 60,
    },
]

function aggregateData(data: DurationDataType[]): DurationDataType[] {
    const resultMap: { [itemName: string]: { totalTime: number, count: number } } = {};

    // 遍历数据数组，累加每个 itemName 对应的时间和数量
    data.forEach(item => {
        if (!resultMap[item.itemName]) {
            resultMap[item.itemName] = { totalTime: 0, count: 0 };
        }
        resultMap[item.itemName].totalTime += item.time;
        resultMap[item.itemName].count++;
    });

    // 构建结果数组，计算每个 itemName 的平均时间
    const result: DurationDataType[] = [];
    Object.keys(resultMap).forEach(itemName => {
        const averageTime = resultMap[itemName].totalTime / resultMap[itemName].count;
        result.push({ itemName, time: averageTime });
    });

    return result;
}

const DurationItem: React.FC<any> = () => {

    const [itemDurationData, setItemDurationData] = useState<DurationDataType[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // 调用 borrowData 函数获取借出的所有记录
                const resData = await borrowData();
                console.log("resData", resData);
                const newData = resData?.data?.map((item) =>
                    item?.backAt ? {
                        itemName: item.item.name,
                        time: (item?.backAt - item?.createDAt) / (1000 * 60 * 60),
                    } : null
                ).filter(Boolean);

                // console.log("newData", newData);
                // console.log("aggregateData(newData)", aggregateData(newData));
                setItemDurationData(aggregateData(newData));
            } catch (error) {
                console.error('获取借出数据出错：', error);
            }
        }

        fetchData();
    }, []);


    return (
        <>
            <Content title={"物品借用时长统计"}>
                <ItemDurationChart itemDurationData={itemDurationData} />
            </Content>
        </>
    );
};

export default DurationItem;
