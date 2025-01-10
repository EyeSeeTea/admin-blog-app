import { useCallback, useMemo, useState } from "react";

import { GlobalMessage, AdminBlogState } from "./AdminBlogState";
import { Pagination, Sorting } from "$/domain/entities/generic/Pagination";
import { Post } from "$/domain/entities/Post";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useReload } from "$/webapp/hooks/useReload";
import { Id } from "$/domain/entities/Ref";
import i18n from "$/utils/i18n";
import { RouteName, useRoutes } from "$/webapp/hooks/useRoutes";

const pagination = {
    pageSizeOptions: [10, 20, 50],
    pageSizeInitialValue: 10,
};

const initialSorting = {
    field: "createdDate" as const,
    order: "desc" as const,
};

export function useAdminBlog(): AdminBlogState {
    const { compositionRoot } = useAppContext();
    const { goTo } = useRoutes();
    const [reloadKey, reload] = useReload();

    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | undefined>(undefined);
    const [currentPost, setCurrentPost] = useState<Post | undefined>(undefined);
    const [postsInPage, setPostsInPage] = useState<Post[] | undefined>(undefined);

    const getPosts = useMemo(
        () => (search: string, paging: Pagination, sorting: Sorting<Post>) => {
            console.debug("Reloading", reloadKey);
            return compositionRoot.posts.get
                .execute({
                    paging,
                    sorting,
                    filters: {
                        searchTerm: search,
                    },
                })
                .toPromise();
        },
        [compositionRoot.posts.get, reloadKey]
    );

    const onClickEditPost = useCallback(
        (id: string) => {
            if (id) {
                goTo(RouteName.EDIT_POST, { id });
            }
        },
        [goTo]
    );

    const onClickCreatePost = useCallback(() => {
        goTo(RouteName.CREATE_POST);
    }, [goTo]);

    const onClickDeletePost = useCallback(
        (postId: Id) => {
            const post = postsInPage?.find(p => p.id === postId);
            if (post) {
                setCurrentPost(post);
            }
        },
        [postsInPage]
    );

    const onCancelDeletePost = useCallback(() => {
        setCurrentPost(undefined);
    }, []);

    const onDeletePost = useCallback(() => {
        if (!currentPost) return;

        compositionRoot.posts.delete.execute(currentPost).run(
            () => {
                setGlobalMessage({
                    text: i18n.t(`Post {{post}} deleted`, {
                        post: currentPost.title,
                    }),
                    type: "success",
                });
                reload();
                setCurrentPost(undefined);
            },
            err => {
                console.debug(err);
                setGlobalMessage({
                    text: i18n.t(`Error deleting post {{post}}`, {
                        post: currentPost.title,
                    }),
                    type: "error",
                });
                setCurrentPost(undefined);
            }
        );
    }, [compositionRoot.posts.delete, currentPost, reload]);

    return {
        getPosts,
        onClickDeletePost,
        onClickEditPost,
        onClickCreatePost,
        onCancelDeletePost,
        onDeletePost,
        setPostsInPage,
        currentPostToDelete: currentPost,
        pagination,
        initialSorting,
        globalMessage,
    };
}
