import { Struct } from "./generic/Struct";
import { Id } from "$/domain/entities/Ref";
import { Either } from "$/domain/entities/generic/Either";
import { ValidationError } from "$/domain/entities/validation-error/ValidationError";
import { validateRequired } from "$/domain/entities/validation-error/validations";

export interface PostAttrs {
    id: Id;
    title: string;
    description: string;
    createdDate: string;
    updatedDate: string;
    image: string;
    content: string;
}

export class Post extends Struct<PostAttrs>() {
    public static createPost(attrs: PostAttrs): Either<ValidationError<Post>[], Post> {
        return this.validateAndCreate(attrs);
    }

    private static validateAndCreate(attrs: PostAttrs): Either<ValidationError<Post>[], Post> {
        const { id, title, description, image, content } = attrs;

        const errors: ValidationError<Post>[] = [
            { property: "id" as const, errors: validateRequired(id), value: id },
            { property: "title" as const, errors: validateRequired(title), value: title },
            {
                property: "description" as const,
                errors: validateRequired(description),
                value: description,
            },
            { property: "image" as const, errors: validateRequired(image), value: image },
            { property: "content" as const, errors: validateRequired(content), value: content },
        ].filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.success(this.create(attrs));
        } else {
            return Either.error(errors);
        }
    }
}
