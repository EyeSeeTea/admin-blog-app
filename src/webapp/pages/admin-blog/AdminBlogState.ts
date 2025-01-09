import { Pagination, Sorting, PaginatedReponse } from "$/domain/entities/generic/Pagination";
import { Post } from "$/domain/entities/Post";

export interface AdminBlogState {
    getPosts: (
        search: string,
        paging: Pagination,
        sorting: Sorting<Post>
    ) => Promise<PaginatedReponse<Post>>;
    onClickDeletePost: (id: string) => void;
    onClickEditPost: (id: string) => void;
    onClickCreatePost: () => void;
    onCancelDeletePost: () => void;
    onDeletePost: () => void;
    setPostsInPage: (posts: Post[]) => void;
    currentPostToDelete?: Post;
    pagination: {
        pageSizeOptions: number[];
        pageSizeInitialValue: number;
    };
    initialSorting: Sorting<Post>;
    globalMessage?: GlobalMessage;
}

export interface GlobalMessage {
    text: string;
    type: "success" | "error";
}
