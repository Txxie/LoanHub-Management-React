// 物品借用情况统计
import React, { useState, useEffect } from 'react';
import Content from "@/components/Content";
import ItemLendingChart from "../components/ItemLendingChart";
import { borrowCount } from "@/api";

// 定义接口来表示项目数据的类型
interface LendingDataType {
    itemName: string;
    count: number;
}

const fakeItemCategoryData = [
    {
        itemName: '文具1',
        count: 10,
    },
    {
        itemName: '文具2',
        count: 30,
    },
    {
        itemName: '文具3',
        count: 40,
    },
    {
        itemName: '文具4',
        count: 20,
    },
    {
        itemName: '文具5',
        count: 60,
    },
]

function getCounts(items: any[]) {
    const itemCounts = {};

    // 统计每个项目的数量
    items.forEach(item => {
        if (itemCounts[item]) {
            itemCounts[item]++;
        } else {
            itemCounts[item] = 1;
        }
    });

    // 将结果转换为对象数组
    const result = Object.keys(itemCounts).map(item => ({
        itemName: item,
        count: itemCounts[item]
    }));

    return result;
}

const LendingItem: React.FC<any> = () => {

    const [itemLendingData, setItemLendingData] = useState<LendingDataType[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // 调用 borrowCount 函数获取借出的所有物品及对应记录数
                const resData = await borrowCount();
                console.log("resData", resData);
                const newData = resData?.data?.map((item: { item: { name: any; }; }) => (item.item.name));
                console.log("newData", newData);
                setItemLendingData(getCounts(newData));
            } catch (error) {
                console.error('获取借出数据出错：', error);
            }
        }

        fetchData();
    }, []);


    return (
        <>
            <Content title={"物品借用情况统计"}>
                <ItemLendingChart itemLendingData={itemLendingData} />
            </Content>
        </>
    );
};

export default LendingItem;
