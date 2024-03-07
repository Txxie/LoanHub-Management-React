import { ItemType } from "@/types";
import request from "@/utils/request";
import qs from "qs";

export const getItemList = (
    params: Partial<Pick<ItemType, "name" | "category" | "code">> & {
        current?: number;
        pageSize?: number;
        all?: boolean;
    }
) => {
    return request.get(`/api/items?${qs.stringify(params)}`);
};

export const itemUpdate = (id: string, params: ItemType) => {
    return request.put(`/api/items/${id}`, params);
};

export const itemAdd = (params: ItemType) => {
    return request.post("/api/items", params);
};

export const getItemDetail = (id: string) => {
    return request.get(`/api/items/${id}`);
};

export const itemDelete = (id: string) => {
    return request.delete(`/api/items/${id}`);
};
