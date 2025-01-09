import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";

import { D2Api } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { PostFilters, PostRepository } from "$/domain/repositories/PostRepository";
import { Post } from "$/domain/entities/Post";
import { Future } from "$/domain/entities/generic/Future";
import { PaginatedReponse, Pagination, Sorting } from "$/domain/entities/generic/Pagination";
import { Id } from "$/domain/entities/Ref";
import { assertOrError } from "$/data/repositories/utils/AssertOrError";
import _ from "$/domain/entities/generic/Collection";
import { validationErrorMessages } from "$/domain/entities/validation-error/ValidationError";

// TODO: Add correct Blog Ids, now it uses Resources Ids
export const BLOG_DATA_ELEMENTS = {
    image: "uund7zjS1Yt",
    title: "iBxOUseHUtO",
    content: "iBxOUseHUtO",
    description: "iBxOUseHUtO",
} as const;

const BLOG_PROGRAM_ID = "wWo0lhm5GsY";
const BLOG_ORG_UNIT_ID = "H8RixfF8ugH";

export class PostD2Repository implements PostRepository {
    constructor(private api: D2Api) {}

    public get(params: {
        paging: Pagination;
        sorting?: Sorting<Post>;
        filters?: PostFilters;
    }): FutureData<PaginatedReponse<Post>> {
        const { paging, sorting, filters } = params;

        const mappedSortingPostToSortingD2Event = sorting
            ? this.mapSortingPostToSortingD2Event(sorting)
            : sorting;

        const filter = _([
            filters?.searchTerm
                ? `${BLOG_DATA_ELEMENTS.title}:like:${filters.searchTerm}`
                : undefined,
        ])
            .compact()
            .join(",");

        const years = filters?.years?.sort();
        const startYear = years ? years[0] : undefined;
        const endYear = years ? years[years.length - 1] : undefined;

        return apiToFuture(
            this.api.tracker.events.get({
                fields: eventsFields,
                program: BLOG_PROGRAM_ID,
                orgUnit: BLOG_ORG_UNIT_ID,
                order: mappedSortingPostToSortingD2Event
                    ? `${mappedSortingPostToSortingD2Event.field}:${mappedSortingPostToSortingD2Event.order}`
                    : "occurredAt:desc",
                occurredAfter: startYear ? `${startYear}-01-01` : undefined,
                occurredBefore: endYear ? `${endYear}-12-31` : undefined,
                filter: filter,
                totalPages: true,
                page: paging.page,
                pageSize: paging.pageSize,
            })
        ).flatMap(response => {
            const posts = response.instances.map(d2Event => this.buildPost(d2Event));

            const paginatedPosts: PaginatedReponse<Post> = {
                objects: posts,
                pager: {
                    total: response.total || 0,
                    page: response.page,
                    pageSize: response.pageSize,
                    pageCount: response.total ? Math.ceil(response.total / paging.pageSize) : 0,
                },
            };

            return Future.success(paginatedPosts);
        });
    }

    public getById(id: Id): FutureData<Post> {
        return apiToFuture(
            this.api.tracker.events.get({
                fields: eventsFields,
                program: BLOG_PROGRAM_ID,
                orgUnit: BLOG_ORG_UNIT_ID,
                event: id,
                skipPaging: true,
            })
        )
            .flatMap(response =>
                assertOrError(response.instances[0], `Error fetching post with id: ${id}`)
            )
            .flatMap(d2Event => {
                try {
                    const post = this.buildPost(d2Event);

                    return Future.success(post);
                } catch (error) {
                    return Future.error(new Error(`${error}`));
                }
            });
    }

    delete(post: Post): FutureData<void> {
        const d2TrackerEvent: D2TrackerEvent = {
            event: post.id,
            status: "COMPLETED",
            program: BLOG_PROGRAM_ID,
            occurredAt: "",
            dataValues: [],
            orgUnit: BLOG_ORG_UNIT_ID,
        };

        return Future.success(undefined);

        // return apiToFuture(
        //     this.api.tracker.post({ importStrategy: "DELETE" }, { events: [d2TrackerEvent] })
        // ).flatMap(deleteResponse => {
        //     if (deleteResponse.status === "ERROR") {
        //         return Future.error(new Error(`Error deleting post: ${deleteResponse.message}`));
        //     } else {
        //         return Future.success(undefined);
        //     }
        // });
    }

    save(post: Post): FutureData<Post> {
        // TODO: Handle image upload too

        const d2TrackerEvent: D2TrackerEvent = this.mapPostToD2EventTracker(post);

        return Future.success(post);

        // return apiToFuture(
        //     this.api.tracker.post(
        //         { importStrategy: "CREATE_AND_UPDATE" },
        //         { events: [d2TrackerEvent] }
        //     )
        // ).flatMap((response: TrackerPostResponse) => {
        //     if (response.status === "ERROR") {
        //         return Future.error(new Error(`Error creating post: ${response.message}`));
        //     } else {
        //         const postId = response?.bundleReport?.typeReportMap?.EVENT?.objectReports[0]?.uid;

        //         if (postId) {
        //             return this.getById(postId);
        //         } else {
        //             return Future.error(new Error(`Error creating post`));
        //         }
        //     }
        // });
    }

    private mapPostToD2EventTracker(post: Post): D2TrackerEvent {
        return {
            event: post.id,
            status: "ACTIVE",
            program: BLOG_PROGRAM_ID,
            occurredAt: post.id ? post.createdDate : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            dataValues: [
                { dataElement: BLOG_DATA_ELEMENTS.title, value: post.title },
                { dataElement: BLOG_DATA_ELEMENTS.image, value: post.image },
                { dataElement: BLOG_DATA_ELEMENTS.description, value: post.description },
                { dataElement: BLOG_DATA_ELEMENTS.content, value: post.content },
            ],
            orgUnit: BLOG_ORG_UNIT_ID,
        };
    }

    private buildPost(d2Event: D2TrackerEvent): Post {
        const id = d2Event.event;
        const createdDateString = d2Event.occurredAt;
        const updatedDateString = d2Event.updatedAt;

        const title =
            d2Event.dataValues.find(dv => dv.dataElement === BLOG_DATA_ELEMENTS.title)?.value ||
            "Title test";
        const image =
            d2Event.dataValues.find(dv => dv.dataElement === BLOG_DATA_ELEMENTS.image)?.value ||
            "/dhis2/api/events/files?dataElementUid=fIrafA0Qbh3&eventUid=losyBXc2SGp";

        const description =
            d2Event.dataValues.find(dv => dv.dataElement === BLOG_DATA_ELEMENTS.description)
                ?.value || "Description test";

        const markdownContentTest = `
# Título en Markdown
## Subtítulo
Este es un ejemplo de **Markdown** con _React_.

- Elemento de lista 1
- Elemento de lista 2
- Elemento de lista 3

> Esto es una cita en Markdown.

[Enlace a GitHub](https://github.com)

`;

        const content =
            d2Event.dataValues.find(dv => dv.dataElement === BLOG_DATA_ELEMENTS.content)?.value ||
            markdownContentTest;

        return Post.createPost({
            id,
            title,
            description,
            createdDate: createdDateString,
            updatedDate: updatedDateString ?? createdDateString,
            image,
            content,
        }).match({
            success: post => post,
            error: errors => {
                const errorMessages = errors
                    .map(e => e.errors.map(e => validationErrorMessages[e]()).join(", "))
                    .join(", ");

                throw new Error(errorMessages);
            },
        });
    }

    private mapSortingPostToSortingD2Event(
        sorting: Sorting<Post>
    ): Sorting<{ occurredAt: string }> {
        switch (sorting.field) {
            case "createdDate":
                return { field: "occurredAt", order: sorting.order };
            default:
                return { field: "occurredAt", order: sorting.order };
        }
    }
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    occurredAt: true,
    updatedAt: true,
} as const;
