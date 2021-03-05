import React from 'react';
import {BrowserRouter as Router,Route,Switch, Redirect } from 'react-router-dom';

import SwitchingBuilder from './containers/Switching/SwitchingBuilder';
import HomePageBuilder from "./containers/HomePageBuilder";
import InteractiveBuilder from './containers/InteractiveTool/InteractiveBuilder';
import TopologiesBuilder from './containers/Topologies/TopologiesBuilder';
import RoutingBuilder from './containers/Routing/RoutingBuilder';

function App(){
  return(
      <Router>
        <Switch>
          <Route exact path="/" component={HomePageBuilder}></Route>
          <Route exact path="/switching" component={SwitchingBuilder}></Route>
          <Route exact path="/topologies" component={TopologiesBuilder}></Route>
          <Route exact path="/routing" component={RoutingBuilder}></Route>
          <Route exact path="/interactive" component={InteractiveBuilder}></Route>
        </Switch>
      </Router>
  );
}

export default App;
