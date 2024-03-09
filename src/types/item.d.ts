export interface ItemType {
    _id?: string; // mongo数据库的id
    name: string;
    code: string;
    itemLocation: string;
    createdAt: string;
    publishAt: number; // 入库日期
    bookNo: string; // 图书编号
    cover: string; // 封面
    stock: number; // 库存
    category: string; // 分类
}

export interface ItemQueryType {
    name: string;
    category: string;
    code: string;
}

export interface ItemFormType {
    title: string;
    editData?: ItemType;
}

export interface CategoryChartType {
    itemCategoryData: Array;
}

export interface LendingChartType {
    itemLendingData: Array;
}
