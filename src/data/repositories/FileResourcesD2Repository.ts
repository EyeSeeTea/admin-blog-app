import { D2Api } from "$/types/d2-api";
import { apiToFuture, FutureData } from "$/data/api-futures";
import { FileResourcesRepository } from "$/domain/repositories/FileResourcesRepository";
import { FileResource } from "$/domain/entities/FileResource";
import { Id } from "$/domain/entities/Ref";
import { Future } from "$/domain/entities/generic/Future";

export class FileResourcesD2Repository implements FileResourcesRepository {
    constructor(private api: D2Api) {}

    public save(fileResource: FileResource): FutureData<FileResource> {
        const formData = new FormData();
        formData.append("file", fileResource.data, fileResource.name);
        formData.append("contentType", fileResource.data.type);
        formData.append("domain", fileResource.domain);
        console.log("formData", formData);

        return apiToFuture(
            this.api.request<FileResponse>({
                url: "/fileResources",
                method: "post",
                requestBodyType: "raw",
                data: formData,
            })
        ).flatMap(response => {
            console.log("response", response);

            const id = response.response?.fileResource?.id;
            if (!id) {
                return Future.error(new Error("Failed to save file resource"));
            } else {
                const savedFileResource: FileResource = { ...fileResource, id: id };
                return Future.success(savedFileResource);
            }
        });
    }
}

type FileResponse = {
    response?: {
        fileResource?: {
            id?: Id;
        };
    };
};
