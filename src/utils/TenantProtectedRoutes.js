import { Suspense } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { tenantRoutes } from "../routes";
import Layout from "../components/Layout";
import Preloader from "../components/Preloader";

const TenantProtectedRoutes = () => {
  const routeMatch = useRouteMatch();
  console.log("Tenant RouteMatch", routeMatch);
  return  (
    <Switch>
      <Suspense fallback={<Preloader />}>
        {tenantRoutes.map(({ component: Component, path, exact }) => (
          <Route path={`${routeMatch.path}${path}`} key={path} exact={exact}>
            <Layout>
              <Component />
            </Layout>
          </Route>
        ))}
      </Suspense>
    </Switch>
  );
}

export default TenantProtectedRoutes;
