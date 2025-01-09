import { PostD2Repository } from "$/data/repositories/PostD2Repository";
import { PostTestRepository } from "$/data/repositories/PostTestRepository";
import { PostRepository } from "$/domain/repositories/PostRepository";
import { DeletePostUseCase } from "$/domain/usecases/DeletePostUseCase";
import { GetPostByIdUseCase } from "$/domain/usecases/GetPostByIdUseCase";
import { GetPostsUseCase } from "$/domain/usecases/GetPostsUseCase";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { D2Api } from "./types/d2-api";
import { SavePostUseCase } from "$/domain/usecases/SavePostUseCase";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    postsRepository: PostRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        posts: {
            get: new GetPostsUseCase(repositories.postsRepository),
            getById: new GetPostByIdUseCase(repositories.postsRepository),
            delete: new DeletePostUseCase(repositories.postsRepository),
            save: new SavePostUseCase(repositories.postsRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        postsRepository: new PostD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        postsRepository: new PostTestRepository(),
    };

    return getCompositionRoot(repositories);
}
