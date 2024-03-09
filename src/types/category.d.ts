export interface CategoryType {
  _id?: string;
  name: string;
  level: string;
  parentLevel: string;
  parent: CategoryType;
  children: CategoryType[];
}

export interface CategoryQueryType {
  name?: string;
  level?: string;
}

export interface CategoryChartType {
  itemCategoryData: Array;
}