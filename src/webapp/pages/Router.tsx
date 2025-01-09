import { HashRouter, Route, Switch } from "react-router-dom";
import { AdminBlogPage } from "./admin-blog/AdminBlogPage";
import { EditPostPage } from "./edit-post/EditPostPage";
import { RouteName, routes } from "$/webapp/hooks/useRoutes";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route path={routes[RouteName.EDIT_POST]} render={() => <EditPostPage />} />
                <Route path={routes[RouteName.CREATE_POST]} render={() => <EditPostPage />} />

                {/* Default route */}
                <Route render={() => <AdminBlogPage />} />
            </Switch>
        </HashRouter>
    );
}
