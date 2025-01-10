import { Id } from "$/domain/entities/Ref";

export type FileResource = {
    id: Id;
    name: string;
    data: Blob;
    domain: "DATA_VALUE";
};
