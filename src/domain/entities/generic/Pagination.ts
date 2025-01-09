export interface Sorting<T> {
    field: keyof T;
    order: "asc" | "desc";
}
export interface Pagination {
    pageSize: number;
    total: number;
    page: number;
}

export interface Pager {
    page: number;
    pageCount: number;
    total: number;
    pageSize: number;
}

export interface PaginatedReponse<T> {
    pager: Pager;
    objects: T[];
}
