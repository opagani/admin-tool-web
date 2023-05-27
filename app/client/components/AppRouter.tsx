import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PolicyDetails from '../pages/PolicyDetails';
import SearchPolicies from '../pages/SearchPolicies';
import Reports from '../pages/Reports';
import UserActivity from '../pages/UserActivity';
import LandlordHistory from '../pages/LandlordHistory';
import NoMatch from '../pages/NoMatch';

const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/">
        <SearchPolicies />
      </Route>
      <Route path="/policy/:policyId" exact>
        <PolicyDetails />
      </Route>
      <Route path="/reports" exact>
        <Reports />
      </Route>
      <Route path="/user-activity" exact>
        <UserActivity />
      </Route>
      <Route path="/user/:userToken" exact>
        <LandlordHistory />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};

export default AppRouter;
