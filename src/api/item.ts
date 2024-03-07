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
    return request.get(`/api/books?${qs.stringify(params)}`);
};

export const bookUpdate = (id: string, params: ItemType) => {
    return request.put(`/api/books/${id}`, params);
};

export const bookAdd = (params: ItemType) => {
    return request.post("/api/books", params);
};

export const getItemDetail = (id: string) => {
    return request.get(`/api/books/${id}`);
};

export const bookDelete = (id: string) => {
    return request.delete(`/api/books/${id}`);
};
