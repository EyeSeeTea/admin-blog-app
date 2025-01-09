import { Future } from "$/domain/entities/generic/Future";
import { FutureData } from "$/data/api-futures";
import { PostFilters, PostRepository } from "$/domain/repositories/PostRepository";
import { PaginatedReponse, Pagination, Sorting } from "$/domain/entities/generic/Pagination";
import { Post } from "$/domain/entities/Post";
import { Id } from "$/domain/entities/Ref";
import { createPost, createPosts } from "$/domain/entities/__tests__/postFixtures";

export class PostTestRepository implements PostRepository {
    public get(_params: {
        paging: Pagination;
        sorting?: Sorting<Post>;
        filters?: PostFilters;
    }): FutureData<PaginatedReponse<Post>> {
        const paginatedPosts: PaginatedReponse<Post> = {
            objects: createPosts(10),
            pager: {
                total: 10,
                page: 1,
                pageSize: 10,
                pageCount: 1,
            },
        };

        return Future.success(paginatedPosts);
    }

    public getById(_id: Id): FutureData<Post> {
        return Future.success(createPost("id1"));
    }

    public delete(_post: Post): FutureData<void> {
        return Future.success(undefined);
    }

    public save(_post: Post): FutureData<Post> {
        return Future.success(createPost("id1"));
    }
}
