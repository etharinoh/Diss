import Navigation from "../../components/navigation";

import * as THREE from "three";
import { Component } from "react";
import React from 'react';
import { TextField, Button, InputLabel, Select, MenuItem, makeStyles, withTheme, ButtonGroup, Grid } from "@material-ui/core"
import "./Interactive.css"

import Connection from "./Connection.js";
import Node from "./Node.js";
import SndRec from "./SenderReciever.js";
import Message from "./Message.js";
import Packet from "./Packet.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import { NormalAnimationBlendMode } from "three";

let nodeMap = new Map();
let connectionMap = new Map();

//Creates an enum for the different options for the selected button
const button_options = {
  ADDNODE: "addNode",
  REMOVENODE: "removeNode",
  ADDCONNECT: "addConnection",
  REMOVECONNECT: "removeConnection",
  SENDREC: "senderReciever",
  MOVENODE: "moveNode",
  INSPECT: "inspectNode",
  CLEAR: "clearAll",
  NONE: "none"
}
//Holds the enum value for which button is selected, used for onclick.
var buttonChecked = button_options.NONE;



var scene = new THREE.Scene();
var camera;
var renderer = new THREE.WebGLRenderer();
var container;

class Tool extends Component {
  componentDidMount() {

    container = document.getElementById('canvas');
    renderer.setSize(container.clientWidth, container.clientHeight);


    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);




    container.appendChild(renderer.domElement);
    container.addEventListener('mousedown', this.clickHandler, false);
    window.addEventListener('resize', listenResize, false);


    camera = new THREE.PerspectiveCamera(10, 1, 0.1, 50000)
    camera.position.z = 12;
    camera.updateProjectionMatrix();

    var animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      TWEEN.update();
    };
    animate();
  }





  clickHandler = (event) => {


    switch (buttonChecked) {
      case button_options.ADDNODE:
        addNode(event);
        break;
      case button_options.ADDCONNECT:
        addConnection(event);
        break;
      case button_options.REMOVENODE:
        removeNode(event);
        break;
      case button_options.REMOVECONNECT:
        removeConnection(event);
        break;
      case button_options.SENDREC:
        sendRevPair(event);
        break;
      case button_options.MOVENODE:
        moveNode(event);
        break;
      case button_options.INSPECT:
        inspectNode(event);
        break;
      case button_options.CLEAR:
        clear();
      default:
        consoleAdd("No mode selected")
    }
  }

  render() {
    return (
      <div id="Tool_Wrapper" >
      </div>
    )
  }
}
function listenResize() {

  //camera.aspect = (container.clientWidth / container.clientHeight);
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);

}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var nodeCount = 1;

function addNode(event) {
  {
    mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;


    const radius = 0.1;

    const segments = 100;
    const geometry = new THREE.CircleGeometry(radius, segments);
    const material = new THREE.MeshBasicMaterial({ color: 0xF2AFAF });
    const node = new THREE.Mesh(geometry, material);
    node.position.set(mouse.x, mouse.y, 1);
    node.name = nodeCount++;
    scene.add(node);
    var newNode = new Node(node.name, node);
    nodeMap.set(node.name, newNode);
    var animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    consoleAdd("Node no: " + node.name + " added at: " + node.position.x + ", " + node.position.y);
  }
}
var intersects = [];
var nodes = [];
var connectionCount = 0;
function addConnection(event) {
  const MATERIAL = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 30 });
  var selectedNode = findNode(event);
  
  if (selectedNode == 0) {
    consoleAdd("not a viable node selected")
  }
  else {
    if (nodes.length == 0) {
      selectedNode.material.color.set(0xff0000);
      nodes.push(selectedNode);
      consoleAdd("Point added at: " + selectedNode.x + ", " + selectedNode.y);
    }
    else if (!selectedNode.position.equals(nodes[0].position)) {
      nodes.push(selectedNode);
      var startNode = new THREE.Vector3(nodes[0].position.x, nodes[0].position.y, 0.9);
      var endNode = new THREE.Vector3(nodes[1].position.x, nodes[1].position.y, 0.9);
      var points = [startNode, endNode];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);


      const line = new THREE.Line(geometry, MATERIAL);
      line.name = connectionCount++;
      var startObj = nodeMap.get(nodes[0].name);
      var endObj = nodeMap.get(nodes[1].name);
      var newConnect = new Connection(startObj, endObj, line); //create with node object
      scene.add(line);
      connectionMap.set(line.name, newConnect);

      nodes.forEach(element => {
        element.material.color.set(0xF2AFAF)
        var node = nodeMap.get(element.name);
      });
      var animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
      consoleAdd("Connection added");
      nodes = [];
    }
  }
}
function findNode(event) {
  //draw a line by selecting two circle, raycaster, highlight
  mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;
  intersects = [];
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(scene.children);
  //closest node
  if (intersects[0]) {

    if (intersects[0].object.type == "Mesh") {
      
      return intersects[0].object;
    }
    else {
      return 0;
    }
  }
  else {
    return 0;
  }

}

//If the click isnt on a 
function removeNode(event) {
  //If a node is clicked, remove the node and any connections that it has
  var toRemove = findNode(event);

  for (let value of connectionMap.values()) {
    if ((toRemove == value.fromNode) || (toRemove == value.toNode)) {
      removeSelected(value.connectorObj);
    }
  }
  nodeMap.delete(toRemove.name);
  scene.remove(toRemove);
}

function removeConnection(event) {
  //If a connection is clicked delete it
  var selectedConnection = findConnection(event);
  if (selectedConnection == 0) {
    consoleAdd("No connection found here")
  }
  else {
    removeSelected(selectedConnection);

  }
}
function findConnection(event) {
  mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;
  intersects = [];
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(scene.children, true);
  //closest node
  intersects[0].object.material.color.set(0xff0000);
  if (intersects[0].object.type == "Line") {
    return intersects[0].object;
  }
  else {
    return 0;
  }
}
function removeSelected(selected) { //TODO make sure everything is deleted
  connectionMap.delete(selected.name);
  scene.remove(selected);
}
function inspectNode(event) {
  var chosen = findNode(event);
  if (chosen == 0) {
    consoleAdd("No node found here");
  }
  else {
    consoleAdd("Node No: " + chosen.name + "at position: " + chosen.position.x + ", " + chosen.position.y);
  }
}
function moveNode(event) {
  //find node
  //select where to move it to
  //change position
  //Redraw connections Take the point on line that 
}
var sender, reciever;
function sendRevPair(event) {
  var chosenNode = findNode(event);
  if (chosenNode != 0) {
    if (!sender) {
      sender = chosenNode;
      chosenNode.material.color.set("#AFF2AF");
    }
    else {


      reciever = chosenNode;
      chosenNode.material.color.set("#AFB1F2");

      var sendRecPair = new SndRec(nodeMap.get(sender.name), nodeMap.get(reciever.name));
      SndRecArray.push(sendRecPair);
      sender = null;
      reciever = null;
    }
  }
  else {
    consoleAdd("No node found near here")
  }

}


/**
 * 
 * Interactive builder class used for the actual page setup
 * 
 * Exports the page to the router.
 * 
 */
class InteractiveBuilder extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return (
      <div id="Interactive_whole">
        <Navigation />
        <div id="Interactive_Container">

          <div id="left">
            <ButtonsGroup />
          </div>
          <div id="canvas">
            <Tool />
          </div>
          <div id="right">
            <div id="init_val">
              <p>Initial Values</p>
              <InitialValues />
            </div>
            <div id="console">
              <p>Console</p>
              <TextField
                id="consoleText"
                multiline
                rows={10}
                variant="outlined"
                rowsMax={Infinity}
                width={100}
                disabled
                fullWidth={true}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * 
 * This is consmetics which are needed for the left and right panels
 * 
 * NEED MOVING INTO SEPARATE FOLDERS AND USE PROPS / STATE
 * 
 */
const useStyles = makeStyles((theme) => ({
  label: {
    margin: theme.spacing(1),
    color: "white"
  },
  state_button: {
    width: "20vh",
    color: "white",
    backgroundColor: "#3b3b3b",
    height: "23vh"

  },
  text: {
    margin: "normal"
  },
  animate: {
    backgroundColor: "#AFF2AF",
    borderColor: "#AFF2AF",
    right: "",
  },
  initVal: {
    color: 'white',
  },
}));

function ButtonsGroup() {
  return (
    <div>
      <Grid item >
        <Button className={useStyles().state_button} onClick={addNodeClick} id="AddNode"> Add Node</Button>
        <Button className={useStyles().state_button} onClick={addConnectionClick} id="AddConnection"> Add Connection</Button>
        <Button className={useStyles().state_button} onClick={removeNodeClick} id="RemoveNode"> Remove Node</Button>
        <Button className={useStyles().state_button} onClick={removeConnectionClick} id="RemoveConnection"> Remove Connection</Button>
      </Grid>
      <Grid item>
        <Button className={useStyles().state_button} onClick={moveNodeClick} id="MoveNode"> Move Node</Button>
        <Button className={useStyles().state_button} onClick={sndRecPairClick} id="SendRecieved"> Create Sender Reciver Pair</Button>
        <Button className={useStyles().state_button} onClick={inspectNodeClick} id="InspectNode"> Inspect Node</Button>
        <Button className={useStyles().state_button} onClick={clear} id="ClearAll"> Clear All</Button>
      </Grid>


    </div>
  )
}
function addNodeClick() {
  if (buttonChecked == button_options.ADDNODE) {
    //Clear colours
    buttonChecked = button_options.NONE;
  }
  else {
    //Clear button method, change to selected
    buttonChecked = button_options.ADDNODE;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}
function removeNodeClick() {
  if (buttonChecked == button_options.REMOVENODE) {
    //Clear colours
    buttonChecked = button_options.NONE;
  }
  else {
    //Clear button method, change to selected
    buttonChecked = button_options.REMOVENODE;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}

function addConnectionClick() {
  if (buttonChecked == button_options.ADDCONNECT) {
    //Clear colours
    buttonChecked = button_options.NONE;
  }
  else {
    //Clear button method, change to selected
    buttonChecked = button_options.ADDCONNECT;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}
function removeConnectionClick() {
  if (buttonChecked == button_options.REMOVECONNECT) {
    //Clear colours
    buttonChecked = button_options.NONE;
  }
  else {
    //Clear button method, change to selected
    buttonChecked = button_options.REMOVECONNECT;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}
function moveNodeClick() {
  if (buttonChecked == button_options.MOVENODE) {
    //Clear colours
    buttonChecked = button_options.NONE;
  }
  else {
    //Clear button method, change to selected
    buttonChecked = button_options.MOVENODE;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}
function sndRecPairClick() {
  if (buttonChecked == button_options.SENDREC) {
    //Clear colours
    buttonChecked = button_options.NONE;
  }
  else {
    //Clear button method, change to selected
    buttonChecked = button_options.SENDREC;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}
function inspectNodeClick() {
  //Output the node, name of the node, connnections, all info that is known.
  if (buttonChecked == button_options.INSPECT) {
    //Clear colours
    buttonChecked = button_options.NONE;
  }
  else {
    //Clear button method, change to selected
    buttonChecked = button_options.INSPECT;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}
function clear() {
  consoleClear();
  buttonChecked = button_options.NONE;
  //clear everythinng of use, maps, queues connections, objects in scene
}

//Initial Values variables.
var Switching_Method;
var PropDelay;
var MsgLength;
var TransRate;
var CircSetupTime;
var HeaderSize;
var PktSize;
var PktRoutingDelay;

//SenderReciver pairs
var SndRecArray = [];

function startCircuitSw() {
  //findbest route
  SndRecArray.forEach(pair => {
    var chosenRoute = findBestRoute(pair); //output chosen route
    consoleAdd("ChosenRoute: "+ chosenRoute)
    console.log(chosenRoute); //TODO need to use the set of points to find their corresponding connections
    //createMessage(pair, chosenRoute);
  });

  //Get all the connection objects and change their color to 
}
function findBestRoute(sendRecPair) {

  findRoutes(sendRecPair);
  var shortestSteps = 0;
  var bestRoute =[];
  
  allRoutes.forEach(function (route) {
    if (bestRoute.length ==0){
      bestRoute = route;
      shortestSteps = route.length;
    }
    if (route.length < shortestSteps) {
      bestRoute = route;
      shortestSteps = route.size;
      
    }
  })
  return bestRoute;
}
function findRoutesAlt(sendRecPair){
  /**
   * 1. Add root node to the stack.
    2. Loop on the stack as long as it's not empty.
      1. Get the node at the top of the stack(current), mark it as visited, and remove it.
      2. For every non-visited child of the current node, do the following:
          1. Check if it's the goal node, If so, then return this child node.
          2. Otherwise, push it to the stack.
          3. If stack is empty, then goal node was not found!
   * 
   */
          
}
function clone(A) {
  return JSON.parse(JSON.stringify(A));
}
function findRoutes(sendRecPair) {
  var start = sendRecPair.sender;
  var end = sendRecPair.reciever;
  var isVisited = new Map();
  var pathList = [start.name];
  var routes =[];
  function findRoutesRec(currentNode, destinationNode, isVisited, local, myArray =[[]]) {
  var otherNode;
  var found;
  //from start node check all connections, if 
  if (currentNode == destinationNode) {
    var currentRoute = clone(local); 
    routes.push(currentRoute);
    console.log(currentRoute);
    allRoutes.push(currentRoute);
    return routes;
  }
    isVisited.set(currentNode.name, true);
  currentNode.getConnectionArr().forEach(connection => {
    //finds out which node in the connection is the current node and saves the other
    
    if (connection.fromNode == currentNode) {
      otherNode = connection.toNode;
    }
    else{
      otherNode = connection.fromNode;
    }

    if (!isVisited.get(otherNode.name)) {
      local.push(otherNode.name);
      found =  findRoutesRec(otherNode, destinationNode, isVisited, local, myArray);
      local.pop();
      console.log("return1", found);
      return found;
      
      
    }
  }
  );
  
  




  isVisited.set(currentNode.name, false);
}
  return findRoutesRec(start, end, isVisited, pathList, []);
}

var allRoutes = [];
var routesFound = 0;

function createMessage(sndRec, route){
  var startNode = sndRec.sender.circleObject;
  const geometry = new THREE.PlaneGeometry(0.1, .015, 32); //MsgLength / 10000
  const material = new THREE.MeshBasicMaterial({ color: 0xAFF2F0, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(startNode.position.x, startNode.position.y, 0.95);
  scene.add(plane);//radians change to
  route.forEach(connection => {
    sendMessage(plane, connection)
  });
}
function sendMessage(message, connection) {
  if((message.position.x == connection.fromNode.circleObject.position.x)&&(message.position.y == connection.fromNode.circleObject.position.y)){
    var position = { x: connection.fromNode.circleObject.position.x, y: connection.fromNode.circleObject.position.y };
    var target = { x: connection.toNode.circleObject.position.x, y: connection.toNode.circleObject.position.y };
  }
  else{
    var target = { x: connection.fromNode.circleObject.position.x, y: connection.fromNode.circleObject.position.y };
    var position = { x: connection.toNode.circleObject.position.x, y: connection.toNode.circleObject.position.y };
  }

  var tween = new TWEEN.Tween(position).to(target, 2000); //2000 == 2s needs changing (propagation delay)
  message.rotateZ(Math.atan2(target.y - position.y, target.x - position.x)); // Trigonometry 
  
  tween.onUpdate( () => {
    message.position.x = position.x;
    message.position.y = position.y;
  }
  );
  consoleAdd("sending message from node: " + connection.fromNode.name + " to " + connection.toNode.name);
  tween.start();
  //use tween.delay(); for (packet routing delay)
}

/**
 * This is the initial values inputs on the right hand side, used for controloling simulation
 * @returns initial values form / inputs
 * 
 * 
 */
function InitialValues() {
  const classes = useStyles();
  const [method, setMethod] = React.useState("");

  const handleChange = (event) => {
    setMethod(event.target.value);
    Switching_Method = event.target.value;
    //@TODO disable the correct fields

    //if circuit enable - circuit setup disable - header, packet, routing delay
    if (Switching_Method == "Circuit") {
      CircSetupTime = document.getElementById("text_Circuit_Setup").disabled = false;
      HeaderSize = document.getElementById("text_Header_Size").disabled = true;
      PktSize = document.getElementById("text_Packet_Size").disabled = true;
      PktRoutingDelay = document.getElementById("text_Routing_Delay").disabled = true;
    }
    else {    //if packet either  enable - header, packet, routing delay disable - circuit setup
      CircSetupTime = document.getElementById("text_Circuit_Setup").disabled = true;

      HeaderSize = document.getElementById("text_Header_Size").disabled = false;
      PktSize = document.getElementById("text_Packet_Size").disabled = false;
      PktRoutingDelay = document.getElementById("text_Routing_Delay").disabled = false;
    }
  }
  function validateInput() {
    if (Switching_Method) {
      if (Switching_Method == "Circuit") {
        if ((!CircSetupTime) && (CircSetupTime.isNan())) {
          document.getElementById("text_Circuit_Setup")()
        }
      }
      else {
        HeaderSize = document.getElementById("text_Header_Size").value;
        PktSize = document.getElementById("text_Packet_Size").value;
        PktRoutingDelay = document.getElementById("text_Routing_Delay").value;
      }
    }
    else {
      return false;
    }
  }
  const animateSimulation = (event) => {
    //take all values from below and 
    PropDelay = document.getElementById("text_Prop_Delay").value;
    MsgLength = document.getElementById("text_Msg_Length").value;
    TransRate = document.getElementById("text_Transmission_Rate").value;

    if (Switching_Method == "Circuit") {
      CircSetupTime = document.getElementById("text_Circuit_Setup").value;
      startCircuitSw();
    }
    else {
      HeaderSize = document.getElementById("text_Header_Size").value;
      PktSize = document.getElementById("text_Packet_Size").value;
      PktRoutingDelay = document.getElementById("text_Routing_Delay").value;
    }

  }

  return (
    <div id="initial_container">
      <InputLabel id="lbl_Sw_Method" className={classes.label} >Switching Method</InputLabel>
      <Select fullWidth labelId="lbl_Sw_Method" id="select_Sw_Method" value={method} onChange={handleChange} margin="dense" color='secondary'>
        <MenuItem value="Circuit">Circuit Switching</MenuItem>
        <MenuItem value="Packet">Packet Switching</MenuItem>
      </Select>
      <TextField fullWidth id="text_Prop_Delay" label="Propagation Delay (secs)" variant="outlined" margin="dense" className={classes.initVal} />
      <TextField fullWidth id="text_Msg_Length" label="Message Length (bits)" variant="outlined" margin="dense" className={classes.initVal} />
      <TextField fullWidth id="text_Transmission_Rate" label="Transmission Rate (bits/sec)" variant="outlined" margin="dense" className={classes.initVal} />
      <TextField fullWidth id="text_Circuit_Setup" label="Circuit Setup Time (secs)" variant="outlined" margin="dense" className={classes.initVal} disabled />
      <TextField fullWidth id="text_Header_Size" label="Header Size (bits)" variant="outlined" margin="dense" className={classes.initVal} disabled />
      <TextField fullWidth id="text_Packet_Size" label="Packet Size (bits)" variant="outlined" margin="dense" className={classes.initVal} disabled />
      <TextField fullWidth id="text_Routing_Delay" label="Packet Routing Delay (secs)" variant="outlined" margin="dense" className={classes.initVal} disabled />
      <Button variant="contained" className={classes.animate} onClick={animateSimulation}>Animate</Button>

    </div>
  )
}



/**
 * Console functions to add and clear to the console on the right hand side, providing updates to the user on internal functions
 * 
 * Unsure if needs moving / own file
 */
function consoleClear() {
  //Get document text and clear
  document.getElementById("consoleText").value = "";
}
function consoleAdd(toAdd) {
  document.getElementById("consoleText").value = ">> " + toAdd + "\n" + document.getElementById("consoleText").value;
}

export default InteractiveBuilder;