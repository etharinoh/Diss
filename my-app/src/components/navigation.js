import * as React from "react";
import { Menu, Button } from '@material-ui/core';
import "./navigation.css";


const Navigation = () => (
    <div id="Nav">
      <Button onClick={event => window.location.href="/"}>Home</Button>
      <Button onClick={event => window.location.href="/packet"}>Packet Switching</Button>
      <Button onClick={event => window.location.href="/circuit"}>Circuit Switching</Button>
      <Button onClick={event => window.location.href="/topologies"}>Topologies</Button>
      <Button onClick={event => window.location.href="/routing"}>Routing</Button>
      <Button onClick={event => window.location.href="/interactive"}>Interactive Tool!</Button>
    </div>
  );

export default Navigation;