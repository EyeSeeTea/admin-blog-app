import { Post } from "$/domain/entities/Post";

export function createPosts(count: number): Post[] {
    return Array.from({ length: count }, (_, i) => createPost(`id${i}`));
}

export function createPost(id: string): Post {
    return Post.createPost({
        id: id,
        title: `Title test ${id}`,
        description: `Description test ${id}`,
        createdDate: "2021-01-01",
        updatedDate: "2021-01-01",
        imageUrl: `https://example.com/image-${id}.png`,
        imageResourceId: `image-${id}`,
        content: `Content test ${id}`,
    }).match({
        success: post => post,
        error: errors => {
            throw new Error(errors.map(e => e.errors.join(", ")).join(", "));
        },
    });
}
