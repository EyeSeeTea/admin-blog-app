import React from "react";
import { generatePath as generatePathRRD, useHistory } from "react-router-dom";

export enum RouteName {
    CREATE_POST = "CREATE_POST",
    EDIT_POST = "EDIT_POST",
    POSTS_LIST = "POSTS_LIST",
}

export const routes: Record<RouteName, string> = {
    [RouteName.CREATE_POST]: `/create-post`,
    [RouteName.EDIT_POST]: `/edit-post/:id`,
    [RouteName.POSTS_LIST]: "/",
} as const;

type RouteParams = {
    [RouteName.CREATE_POST]: undefined;
    [RouteName.EDIT_POST]: { id: string };
    [RouteName.POSTS_LIST]: undefined;
};

type State = {
    goTo: <T extends RouteName>(route: T, params?: RouteParams[T]) => void;
    generatePath: <T extends RouteName>(route: T, params?: RouteParams[T]) => string;
};

export function useRoutes(): State {
    const history = useHistory();

    const goTo = React.useCallback(
        <T extends RouteName>(route: T, params?: RouteParams[T]) => {
            const path = generatePathRRD(routes[route], params as any);
            history.push(path);
        },
        [history]
    );

    const generatePath = React.useCallback(
        <T extends RouteName>(route: T, params?: RouteParams[T]) => {
            const path = generatePathRRD(routes[route], params as any);
            return path;
        },
        []
    );

    return { goTo, generatePath };
}
