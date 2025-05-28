import { Suspense } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { tenantManagent } from "../routes";
import Layout from "../components/TenantManage/Layout";
import Preloader from "../components/Preloader";

const TenantAdminRoutes = () => {
  const routeMatch = useRouteMatch();
  console.log("Tenant RouteMatch", routeMatch);
  return  (
    <Switch>
      <Suspense fallback={<Preloader />}>
        {tenantManagent.map(({ component: Component, path, exact }) => (
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

export default TenantAdminRoutes;
