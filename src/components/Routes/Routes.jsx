import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Dashboard";
import Auth from "../Auth";

const Routes = () => (
  <Switch>
    <PrivateRoute exact path="/" component={Dashboard} />
    <PrivateRoute
      path="/update-profile"
      component={Auth}
      componentProps={{ type: "update" }}
    />
    <Route path="/login" render={(props) => <Auth type="login" {...props} />} />
    <Route
      path="/signup"
      render={(props) => <Auth type="signup" {...props} />}
    />
    <Route
      path="/forgot-password"
      render={(props) => <Auth type="forgot-password" {...props} />}
    />
  </Switch>
);

export default Routes;
