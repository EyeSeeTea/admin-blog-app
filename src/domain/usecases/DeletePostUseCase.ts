import { FutureData } from "$/data/api-futures";
import { Post } from "$/domain/entities/Post";
import { PostRepository } from "$/domain/repositories/PostRepository";

export class DeletePostUseCase {
    constructor(private postsRepository: PostRepository) {}

    public execute(post: Post): FutureData<void> {
        return this.postsRepository.delete(post);
    }
}
