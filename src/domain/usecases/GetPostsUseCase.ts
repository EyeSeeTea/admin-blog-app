import { FutureData } from "$/data/api-futures";
import { PaginatedReponse, Pagination, Sorting } from "$/domain/entities/generic/Pagination";
import { Post } from "$/domain/entities/Post";
import { PostFilters, PostRepository } from "$/domain/repositories/PostRepository";

export class GetPostsUseCase {
    constructor(private postsRepository: PostRepository) {}

    public execute(params: {
        paging: Pagination;
        sorting?: Sorting<Post>;
        filters?: PostFilters;
    }): FutureData<PaginatedReponse<Post>> {
        return this.postsRepository.get(params);
    }
}
