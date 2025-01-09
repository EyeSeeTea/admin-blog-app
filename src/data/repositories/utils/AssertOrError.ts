import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";

export function assertOrError<T>(obj: T, name: string): FutureData<NonNullable<T>> {
    if (!obj) return Future.error(new Error(`${name} not found`));
    else return Future.success(obj);
}
