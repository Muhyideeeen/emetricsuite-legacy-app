import Preloader from "./components/Preloader";
import { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import ServiceAccountDashboard from "./pages/serviceAccount/dashboard";
import CreateOrganizationPage from "./pages/serviceAccount/createOrganization";
// import UserDashboard from './pages/UserDashboard';
import OrganisationStructurePage from "./pages/serviceAccount/orgStructure";
import SettingsPage from "./pages/serviceAccount/settings";

import TenantLoginPage from "./pages/tenantLogin";
// import ResetPasswordPage from './pages/resetPassword';
import PrivateRoute from "./utils/PrivateRoute";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import TenantProtectedRoutes from "./utils/TenantProtectedRoutes";
import TenantPrivateRoute from "./utils/TenantPrivateRoute";
import TenantValidateEmail from "./pages/TenantValidateEmail";
import UnAuthPage from "./pages/UnAuthPage";
import Logout from "./pages/LogOut";
import {ErrorBoundary} from 'react-error-boundary';

import AccessTokenDenied from "./pages/ErrorPages/AccessTokenDenied";
import SomethingWentWrong from "./pages/ErrorPages/SomthingWentWrong";
import ServerError from "./pages/ErrorPages/ServerError"
import TenantManageLogin from "./pages/SuperadminManagment/login";
import TenantAdminRoutes from "./utils/TenantAdminRoutes";
import TenantAdminRoute from "./utils/TenantAdminRoute";
import  ForgotPasswordPage from "./pages/forgotPassword"
import LoginPage  from "./pages/login";
import SignUpPage  from "./pages/signUp";
import forgotPassword  from "./pages/forgotPassword";
import RestPassword  from "./pages/RestPassword";
import ValidateEmailPage  from "./pages/validateEmail";
import _404Page  from "./pages/_404";
// const SignUpPage = lazy(() => import("./pages/signUp"));
// const ForgotPasswordPage = lazy(() => import("./pages/forgotPassword"));
// const RestPassword = lazy(()=> import("./pages/RestPassword")) 
// const ValidateEmailPage = lazy(() => import("./pages/validateEmail"));
// const _404Page = lazy(() => import("./pages/_404"));

const ErrorFallback=({error}:{error:any}) => {
    console.log(error,"THIS IS FORM ERROR BOUNDARY",error.response)

    if(error?.response?.status===401){
      return ( <AccessTokenDenied/> )
    }

    if(error?.response?.status===500){
      return ( <ServerError/> )
    }
    if(error?.status === 401){
      return ( <AccessTokenDenied/> )
    }
  return (
    // <div role="alert">
<SomethingWentWrong/>
    //   {/* <p>Something went wrong</p> */}
    //   {/* <pre style={{color: 'red'}}>{error.message}</pre> */}
    // </div>
  )
}

const errorHandler=(error:any,errorInfo:any)=>{
  console.log("Boundary For Handling Error",{
      "error":error,
      "errorInfo":errorInfo,
      "status_code":[error.status_code]
  })
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>

    {/* <Suspense fallback={Preloader}> */}
      <Switch>
        <Route exact path="/admin/login">
          <LoginPage />
        </Route>
        
        <Route exact path="/tenant-management/login">
          <TenantManageLogin />
        </Route>
        <Route exact path="/sign-up">
          <SignUpPage />
        </Route>
        <Route exact path="/forgot-password">
          <ForgotPasswordPage />
        </Route>
        <Route exact path={"/password/reset/"}>
          <RestPassword />
        </Route>
        <Route exact path="/account/verify">
          <ValidateEmailPage />
        </Route>

        <Route exact path={'/account/verify/service'}>
          <TenantValidateEmail />
        </Route>
        

        {/* Tenant Routes */}
        <Route exact path="/">
          <TenantLoginPage />
        </Route>
        <Route exact path={'/tenant-logout'}>
          <Logout/>
        </Route>
        {/* PrivateRoute for admin and super user */}
        <PrivateRoute path="/admin">
          <ProtectedRoutes />
        </PrivateRoute>

        <TenantPrivateRoute path="/dashboard">
          <TenantProtectedRoutes />
        </TenantPrivateRoute>
        {/* <Route path="/reset-password" component={ResetPasswordPage} /> */}

        <TenantAdminRoute path='/tenant-management'>
          <TenantAdminRoutes/>
        </TenantAdminRoute>

        <Route path="/unauthpage">
          <UnAuthPage />
        </Route>
        <Route path="*">
          <_404Page />
        </Route>
      </Switch>
    {/* </Suspense> */}
    </ErrorBoundary>

  );
}
export default App;
