
import { Route, Redirect, useHistory } from 'react-router-dom';
import TokenService from "../services/token.service";


const TenantAdminRoute = ({ children, ...rest }) => {
  const accessToken = TokenService.getLocalAccessToken();
  const isAuthenticated = accessToken ? true : false;
  const history = useHistory();
  // const decodedToken = jwt_decode(accessToken);
  //Here is where we should check if user is admin or super_admin e.t.c
  // if (decodedToken.user === "admin") {
  //   history.push('/admin')
  // }
  return (
    <Route
      {...rest}
      render={({location}) =>
        !isAuthenticated ? (
          <Redirect to={{ pathname: '/tenant-management/login', state: { from: location } }} />
        ) : (
          children
        )
      }
    />
  );
};

export default TenantAdminRoute;
