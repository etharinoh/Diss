import * as React from "react";
import { Menu, Button } from '@material-ui/core';
import "./navigation.css";


const Navigation = () => (
    <div id="Nav">
      <Button onClick={event => window.location.href="/"}>Home</Button>
      <Button onClick={event => window.location.href="/switching"}>Switching</Button>
      <Button onClick={event => window.location.href="/topologies"}>Topologies</Button>
      <Button onClick={event => window.location.href="/routing"}>Routing</Button>
      <Button onClick={event => window.location.href="/interactive"}>Interactive Tool!</Button>
    </div>
  );

export default Navigation;