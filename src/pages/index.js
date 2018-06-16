import Elections from './elections';
import Header from '../components/header';
import Home from './home';
import NotFound from './not-found';
import React, {Fragment} from 'react';
import {Switch, Route} from 'react-router-dom';

const Pages = () => (
  <Fragment>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/elections" component={Elections} />
      <Route component={NotFound} />
    </Switch>
  </Fragment>
);

export default Pages;
