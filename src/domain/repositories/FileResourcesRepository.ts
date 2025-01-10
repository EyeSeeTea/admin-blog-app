import { FutureData } from "$/data/api-futures";
import { FileResource } from "$/domain/entities/FileResource";

export interface FileResourcesRepository {
    save(fileResource: FileResource): FutureData<FileResource>;
}
