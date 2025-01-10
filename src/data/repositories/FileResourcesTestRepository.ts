import { Future } from "$/domain/entities/generic/Future";
import { FutureData } from "$/data/api-futures";
import { FileResourcesRepository } from "$/domain/repositories/FileResourcesRepository";
import { FileResource } from "$/domain/entities/FileResource";

export class FileResourcesTestRepository implements FileResourcesRepository {
    public save(fileResource: FileResource): FutureData<FileResource> {
        return Future.success({
            ...fileResource,
            id: "test-id",
        });
    }
}
