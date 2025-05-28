import { Route, Redirect, useHistory } from 'react-router-dom';
import TokenService from "../services/token.service";

const TenantPrivateRoute = ({ children, ...rest }) => {
  const accessToken = TokenService.getLocalAccessToken("client_tokens");
  const isAuthenticated = accessToken ? true : false;
  const history = useHistory();
  return (
    <Route
      {...rest}
      render={({location}) =>
        !isAuthenticated ? (
          <Redirect to={{ pathname: '/', state: { from: location } }} />
        ) : (
          children
        )
      }
    />
  );
};

export default TenantPrivateRoute;
