// 物品分类统计
import React, { useState, useEffect } from 'react';
import Content from "@/components/Content";
import ItemCategoryChart from "./components/ItemCategoryChart";
import { categoryQuantity } from "@/api";

const fakeItemCategoryData = [
    {
        categoryName: '文具1',
        quantity: 10,
    },
    {
        categoryName: '文具2',
        quantity: 30,
    },
    {
        categoryName: '文具3',
        quantity: 40,
    },
    {
        categoryName: '文具4',
        quantity: 20,
    },
    {
        categoryName: '文具5',
        quantity: 60,
    },
]


export default function ItemData() {

    const [itemCategoryData, setItemCategoryData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // 调用 categoryQuantity 函数获取分类数量数据
                const resData = await categoryQuantity();
                // console.log("resData", resData);
                const newData = resData?.data?.map((item) => ({
                    categoryName: item.name,
                    quantity: item.quantity,
                }));
                // console.log("newData", newData);
                setItemCategoryData(newData);
            } catch (error) {
                console.error('获取分类数量数据时出错：', error);
            }
        }

        fetchData();
    }, []);


    return (
        <>
            <Content title={"物品分类统计"}>
                <ItemCategoryChart itemCategoryData={itemCategoryData} />
            </Content>
        </>
    );
}
