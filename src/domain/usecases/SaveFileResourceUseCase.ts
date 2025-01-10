import { FutureData } from "$/data/api-futures";
import { FileResource } from "$/domain/entities/FileResource";
import { FileResourcesRepository } from "$/domain/repositories/FileResourcesRepository";

export class SaveFileResourceUseCase {
    constructor(private fileResourcesRepository: FileResourcesRepository) {}

    public execute(fileResource: FileResource): FutureData<FileResource> {
        return this.fileResourcesRepository.save(fileResource);
    }
}
