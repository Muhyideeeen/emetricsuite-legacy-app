import { Box } from "@chakra-ui/layout";
import { Switch, Route } from "react-router-dom";
import Layout from "../../components/serviceAccount/Layout";

import {serviceAccountRoutes} from "../../routes";

const ServiceAccountDashboard = () => {
  return (
    <Box overflowX="hidden">
      <Layout>
        <Switch>
          <>
            {serviceAccountRoutes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </>
        </Switch>
      </Layout>
    </Box>
  );
};

export default ServiceAccountDashboard;
