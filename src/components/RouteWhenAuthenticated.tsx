import { isAuthenticated } from '../firebase';
import { Route, Redirect } from 'react-router-dom';
import * as React from 'react';

interface RouteWhenAuthenticatedProps {
  component: any;
  path: string;
  exact?: boolean;
}

const RouteWhenAuthenticated: React.StatelessComponent<RouteWhenAuthenticatedProps> = ({
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props: any) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )}
  />
);

export default RouteWhenAuthenticated;
