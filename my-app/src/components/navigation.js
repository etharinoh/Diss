import * as React from "react";
import { Menu, Button } from '@material-ui/core';
import "./navigation.css";


const Navigation = () => (
  
    <div id="Nav">
    <Button disabled ><b>Netwrk.JS</b></Button>
      <Button onClick={event => window.location.href="/Diss/#/"}>Home</Button>
      <Button onClick={event => window.location.href="/Diss/#/topologies"}>Topologies</Button>
      <Button onClick={event => window.location.href="/Diss/#/switching"}>Switching</Button>
      <Button onClick={event => window.location.href="/Diss/#/routing"}>Routing</Button>
      <Button onClick={event => window.location.href="/Diss/#/interactive"}>Interactive Tool!</Button>
    </div>
  );

export default Navigation;