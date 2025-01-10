import { FutureData } from "$/data/api-futures";
import { Post } from "$/domain/entities/Post";
import { PostRepository } from "$/domain/repositories/PostRepository";

export class SavePostUseCase {
    constructor(private postsRepository: PostRepository) {}

    public execute(post: Post): FutureData<Post> {
        return this.postsRepository.save(post);
    }
}
