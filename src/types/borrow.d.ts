import { BORROW_STATUS } from "@/constants";

import { ItemType } from "./item";
import { UserType } from "./user";

export interface BorrowQueryType {
  current: number;
  pageSize: number;
  item?: string;
  user?: string;
  code?: string;
  status?: BORROW_STATUS;
}

export interface BorrowOptionType {
  label: string;
  stock: number;
  value: string;
}

export interface BorrowType {
  _id?: string;
  item: ItemType;
  user: UserType;
  status: BORROW_STATUS;
}

export interface BorrowFormType {
  title: string;
}

export interface LendingChartType {
  itemLendingData: Array;
}

export interface DurationChartType {
  itemDurationData: Array;
}