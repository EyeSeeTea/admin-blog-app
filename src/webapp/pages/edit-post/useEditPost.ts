import { useCallback, useEffect, useState } from "react";

import { Post } from "$/domain/entities/Post";
import { Id } from "$/domain/entities/Ref";
import {
    ValidationError,
    validationErrorMessages,
} from "$/domain/entities/validation-error/ValidationError";
import i18n from "$/utils/i18n";
import { Maybe } from "$/utils/ts-utils";
import { useAppContext } from "$/webapp/contexts/app-context";
import { RouteName, useRoutes } from "$/webapp/hooks/useRoutes";

type State = {
    postState: PostLoadState;
    globalMessage: Maybe<GlobalMessage>;
    handleContentChange: (content: string) => void;
    handleDescriptionChange: (description: string) => void;
    handleImageChange: (image: string) => void;
    handleTitleChange: (title: string) => void;
    onSavePost: () => void;
    onClickCancel: () => void;
    onRemoveImage: () => void;
    errors: ValidationError<Post>[];
    getErrorMessage: (key: keyof PostState) => string | undefined;
};

type PostState = {
    id: Id;
    title: string;
    description: string;
    createdDate: string;
    updatedDate: string;
    image: string;
    content: string;
};

export type GlobalMessage = {
    text: string;
    type: "warning" | "success" | "error";
};

export type PostStateLoaded = {
    kind: "loaded";
    data: PostState;
};

export type PostStateLoading = {
    kind: "loading";
};

export type PostStateError = {
    kind: "error";
    message: string;
};

export type PostLoadState = PostStateLoaded | PostStateLoading | PostStateError;

export function useEditPost(id: Maybe<Id>): State {
    const { compositionRoot } = useAppContext();
    const { goTo } = useRoutes();

    const [postState, setPostState] = useState<PostLoadState>({ kind: "loading" });
    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [errors, setErrors] = useState<ValidationError<Post>[]>([]);

    useEffect(() => {
        if (id) {
            compositionRoot.posts.getById.execute(id).run(
                (postData: Post) => {
                    setPostState({
                        kind: "loaded",
                        data: mapPostToPostState(postData),
                    });
                },
                error => {
                    console.error(error);
                    setPostState({
                        kind: "error",
                        message: i18n.t(`Error loading post: ${error}`),
                    });
                    setGlobalMessage({
                        text: i18n.t(`Error loading post: ${error}`),
                        type: "error",
                    });
                }
            );
        } else {
            setPostState({
                kind: "loaded",
                data: getInitialPostState(),
            });
        }
    }, [compositionRoot.posts.getById, id]);

    const handleStateChange = useCallback(
        (key: keyof PostState, value: PostState[keyof PostState]) => {
            if (postState.kind !== "loaded") return;

            const newPostState: PostState = {
                ...postState.data,
                [key]: value,
            };

            const cleanErrors = errors.filter(error => error.property !== key);
            setErrors(cleanErrors);

            setPostState({
                kind: "loaded",
                data: newPostState,
            });
        },
        [errors, postState]
    );

    const handleTitleChange = useCallback(
        (title: string) => {
            handleStateChange("title", title);
        },
        [handleStateChange]
    );

    const handleDescriptionChange = useCallback(
        (description: string) => {
            handleStateChange("description", description);
        },
        [handleStateChange]
    );

    const handleImageChange = useCallback(
        (image: string) => {
            handleStateChange("image", image);
        },
        [handleStateChange]
    );

    const handleContentChange = useCallback(
        (content: string) => {
            handleStateChange("content", content);
        },
        [handleStateChange]
    );

    const onRemoveImage = useCallback(() => {
        handleImageChange("");
    }, [handleImageChange]);

    const getErrorMessage = useCallback(
        (key: keyof PostState) => {
            return errors
                .find(e => e.property === key)
                ?.errors.map(e => validationErrorMessages[e]())
                .join(", ");
        },
        [errors]
    );

    const onSavePost = useCallback(() => {
        if (postState.kind !== "loaded") return;

        const result = Post.createPost({
            id: postState.data.id,
            title: postState.data.title,
            description: postState.data.description,
            createdDate: postState.data.createdDate,
            updatedDate: new Date().toISOString(),
            image: postState.data.image,
            content: postState.data.content,
        });

        const errors: ValidationError<Post>[] = result.match({
            success: () => [],
            error: errors => errors,
        });

        if (errors.length > 0) {
            setErrors(errors);
            return;
        } else {
            const post: Post = result.match({
                success: post => post,
                error: () => {
                    throw new Error("Unexpected error");
                },
            });
            setErrors([]);

            compositionRoot.posts.save.execute(post).run(
                () => {
                    setGlobalMessage({
                        text: i18n.t(`Post {{post}} saved`, {
                            post: post.title,
                        }),
                        type: "success",
                    });
                    goTo(RouteName.POSTS_LIST);
                },
                err => {
                    console.debug(err);
                    setGlobalMessage({
                        text: i18n.t(`Error saving post {{post}}`, {
                            post: post.title,
                        }),
                        type: "error",
                    });
                }
            );
        }
    }, [postState, goTo, compositionRoot.posts.save]);

    const onClickCancel = useCallback(() => {
        goTo(RouteName.POSTS_LIST);
    }, [goTo]);

    return {
        postState: postState,
        globalMessage: globalMessage,
        handleTitleChange: handleTitleChange,
        handleDescriptionChange: handleDescriptionChange,
        handleImageChange: handleImageChange,
        handleContentChange: handleContentChange,
        onSavePost: onSavePost,
        onClickCancel: onClickCancel,
        onRemoveImage: onRemoveImage,
        errors: errors,
        getErrorMessage: getErrorMessage,
    };
}

function mapPostToPostState(post: Post): PostState {
    return {
        id: post.id,
        title: post.title,
        description: post.description,
        createdDate: post.createdDate,
        updatedDate: post.updatedDate,
        image: post.image,
        content: post.content,
    };
}

function getInitialPostState(): PostState {
    return {
        id: "",
        title: "",
        description: "",
        createdDate: "",
        updatedDate: "",
        image: "",
        content: "",
    };
}
