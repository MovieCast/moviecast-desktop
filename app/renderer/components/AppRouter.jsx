import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter as Router } from 'react-router-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import AppFrame from '../containers/AppFrame';
import AppContent from './AppContent';
import MoviesCatalog from '../containers/MoviesCatalog';
import MovieDetail from '../containers/MovieDetail';

export default function AppRouter({ history }) {
  return (
    <Router history={history}>
      <AppFrame>
        <AppContent>
          <Switch>
            <Route path="/movie/:id" component={MovieDetail} />
            <Route path="/movies" component={MoviesCatalog} />

            {/* TODO: Show a loader, since we actually want to load our settings at this moment */}
            <Route
              path="/"
              render={() => (
                <Redirect to="movies" />
              )}
            />
          </Switch>
        </AppContent>
      </AppFrame>
    </Router>
  );
}

/* eslint-disable react/forbid-prop-types */
AppRouter.propTypes = {
  history: PropTypes.object.isRequired
};
/* eslint-enable react/forbid-prop-types */