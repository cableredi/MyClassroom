import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import TokenService from '../../Services/token-service';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
      const userRole = TokenService.readJwtToken().role;

        if (!TokenService.hasAuthToken()) {
            // not logged in so redirect to login page with the return url
            return (
              <Redirect 
                to={{ pathname: '/login', 
                state: { from: props.location } }} />
            )
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(userRole) === -1) {
            // role not authoriszd so redirect to calendar page
            return <Redirect to={{ pathname: '/calendar'}} />
        }

        // authorized so return component
        return <Component {...props} />
    }} />
)