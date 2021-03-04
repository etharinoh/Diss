import React from 'react';
import {BrowserRouter as Router,Route,Switch, Redirect } from 'react-router-dom';

import CircuitSwitchBuilder from './containers/CircuitSwitchBuilder';
import HomePageBuilder from "./containers/HomePageBuilder";
import InteractiveBuilder from './containers/InteractiveBuilder';
import PacketSwitchBuilder from './containers/PacketSwitchBuilder';
import TopologiesBuilder from './containers/TopologiesBuilder';
import RoutingBuilder from './containers/RoutingBuilder';

function App(){
  return(
      <Router>
        <Switch>
          <Route exact path="/" component={HomePageBuilder}></Route>
          <Route exact path="/circuit" component={CircuitSwitchBuilder}></Route>
          <Route exact path="/packet" component={PacketSwitchBuilder}></Route>
          <Route exact path="/topologies" component={TopologiesBuilder}></Route>
          <Route exact path="/routing" component={RoutingBuilder}></Route>
          <Route exact path="/interactive" component={InteractiveBuilder}></Route>
        </Switch>
      </Router>
  );
}

export default App;
