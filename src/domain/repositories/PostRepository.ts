import { FutureData } from "$/data/api-futures";
import { PaginatedReponse, Pagination, Sorting } from "$/domain/entities/generic/Pagination";
import { Post } from "$/domain/entities/Post";
import { Id } from "$/domain/entities/Ref";

export interface PostFilters {
    searchTerm?: string;
    years?: string[];
}

export interface PostRepository {
    get(params: {
        paging: Pagination;
        sorting?: Sorting<Post>;
        filters?: PostFilters;
    }): FutureData<PaginatedReponse<Post>>;
    getById(id: Id): FutureData<Post>;
    delete(post: Post): FutureData<void>;
    save(post: Post): FutureData<Post>;
}
