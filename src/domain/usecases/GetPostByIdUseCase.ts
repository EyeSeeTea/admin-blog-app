import { FutureData } from "$/data/api-futures";
import { Post } from "$/domain/entities/Post";
import { Id } from "$/domain/entities/Ref";
import { PostRepository } from "$/domain/repositories/PostRepository";

export class GetPostByIdUseCase {
    constructor(private postsRepository: PostRepository) {}

    public execute(id: Id): FutureData<Post> {
        return this.postsRepository.getById(id);
    }
}
