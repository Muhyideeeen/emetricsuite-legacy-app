import { Suspense } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { serviceAccountRoutes } from "../routes";
import Layout from "../components/serviceAccount/Layout";
import Preloader from "../components/Preloader";

const ProtectedRoutes = () => {
  const routeMatch = useRouteMatch();
  return  (
    <Switch>
      <Suspense fallback={<Preloader/>}>
        {serviceAccountRoutes.map(({ component: Component, path, exact }) => (
          <Route
            // path={`${path === "/" ? ["/", "/organization-structure"] : path}`}
            path={`${routeMatch.path}${path}`}
            key={path}
            exact={exact}
          >
            {path === "/create-organization" ? (
              <Component />
            ) : (
              <Layout>
                <Component />
              </Layout>
            )}
          </Route>
        ))}
      </Suspense>
    </Switch>
  );
}

export default ProtectedRoutes;
