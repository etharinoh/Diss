import Navigation from "../../components/navigation";

import * as THREE from "three";
import { Component } from "react";
import React from 'react';
import { TextField, Button, InputLabel, Select, MenuItem, makeStyles, withTheme, ButtonGroup, Grid, BottomNavigation } from "@material-ui/core"
import "./Interactive.css"

import Connection from "./Connection.js";
import Node from "./Node.js";
import SndRec from "./SenderReciever.js";
import Message from "./Message.js";
import Packet from "./Packet.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import { GeometryUtils, NormalAnimationBlendMode } from "three";
import { grey } from "@material-ui/core/colors";

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


//Global variables needed for ThreeJS
var scene = new THREE.Scene();
var camera;
var renderer = new THREE.WebGLRenderer();
var container;

/**
 * THis is the class which is used to add the scene and setup animation and events for it
 */
class Tool extends Component {
  componentDidMount() {
    
    container = document.getElementById('canvas');
    renderer.setSize(container.clientWidth, container.clientHeight);


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




  /**
   * This is used for handling which method is used when the canvas is clicked
   * @param {*} event the event when it has been triggered
   */
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
/**
 * 
 */
function listenResize() {

  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  //camera.aspect = container.clientWidth / container.clientHeight

}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var nodeCount = 1;
/**
 * This is the method for adding a node to the canvas 
 * 
 * @param {*} event This is the event which is used to know where the mouse position is
 */
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

/**
 * This will check how many nodes have been selected, if none are selected highlight the selected, if one is selected then a line is connected between them
 * 
 * @param {*} event The event used for where the mouse click was
 */
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
      line.geometry.attributes.position.needsUpdate = true;
      connectionMap.set(line.name, newConnect);
      nodes.forEach(element => {
        changeColor(element);
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
/**
 * This is used to check if a node is a sender or reciever before changing its color back
 * 
 * @param {*} node The node whos node needs its color changing back
 */
function changeColor(node){
  var snd = false, rec = false;
  SndRecArray.forEach(pair =>{
    if(node == pair.sender.circleObject){
      snd = true
    }
    else if(node ==pair.reciever.circleObject){
      rec = true
    }
  });
  if(snd){
    node.material.color.set("#AFF2AF");
  }
  else if(rec){
    node.material.color.set("#AFB1F2");
  }
  else{
    node.material.color.set(0xF2AFAF)
  }
}
/**
 * This is the auxillary function using threejs raycaster to select a node from the scene.
 * 
 * @param {*} event This is the event used to find the mouse position
 * @returns Either the first intersect or the number 0
 */
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

/**
 * Calls the find node to select a node and then removes th3e node and all of its connections.
 * 
 * @param {*} event The event when this is called
 */
function removeNode(event) {
  //If a node is clicked, remove the node and any connections that it has
  var toRemove = findNode(event);

  for (let value of connectionMap.values()) {
    if ((toRemove == value.fromNode.circleObject) || (toRemove == value.toNode.circleObject)) {
      removeSelected(value.connectorObj);
    }
  }
  nodeMap.delete(toRemove.name);
  scene.remove(toRemove);
}
/**
 * This is used to select and remove a connection, but there are issues with selection
 * 
 * @param {*} event The event when this is called for raycasting
 */
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
/**
 * This is used to select a connection, but has issues with raycasting
 * 
 * @param {*} event used to find the mouse point where clicked
 * @returns their the intersect or 0
 */
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
/**
 * This is used to remove a selected node from the scene and connection map
 * 
 * @param {*} selected The selected node
 */
function removeSelected(selected) { 
  connectionMap.delete(selected.name);
  scene.remove(selected);
}
/**
 * THis is used to return information of abhout the selected node to the console.
 * 
 * @param {*} event USed for finding the node
 */
function inspectNode(event) {
  var chosen = findNode(event);
  if (chosen == 0) {
    consoleAdd("No node found here");
  }
  else {
    consoleAdd("Node No: " + chosen.name + "at position: " + chosen.position.x + ", " + chosen.position.y);
  }
}
var selected = 0;
/**
 * This is used to move a node from one position to the next selected position
 * 
 * @param {*} event used to find and move the node
 */
function moveNode(event) {

  mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;
  if (selected == 0) {
    var chosen = findNode(event)
    selected = chosen;
    if (chosen == 0) {
      consoleAdd("No node found here");
    }
    else{
      consoleAdd("Node "+chosen.name + " has been selected to move")
      chosen.material.color.set(0xff0000);
    }
    
  }
  else {
    selected.position.set(mouse.x, mouse.y, 1);
    var nodeObj = nodeMap.get(selected.name);
    nodeObj.getConnectionArr().forEach(element => {
      element.connectorObj.geometry.attributes.position.needsUpdate = true;
      if (element.fromNode.circleObject == selected) {
        element.connectorObj.geometry.attributes.position.array[0] = mouse.x
        element.connectorObj.geometry.attributes.position.array[1] = mouse.y
      }
      else if (element.toNode.circleObject == selected) {
        element.connectorObj.geometry.attributes.position.array[3] = mouse.x
        element.connectorObj.geometry.attributes.position.array[4] = mouse.y
      }
    });
    consoleAdd("Node "+selected.name+" has been moved");
    changeColor(selected)
    selected = 0;


  }
}
var sender, reciever;
/**
 * This is used to create a sender reciever pair and add it to the array
 * 
 * @param {*} event Used for finding the node
 */
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
 */
class InteractiveBuilder extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return (
      <div id="Interactive_whole" >
        <Navigation />
        <div id="Interactive_Container">

          <div id="left">
            <ButtonsGroup />
          </div>
          <div id="canvas">
            <Tool />
          </div>
          <div id="right">
          <Grid container spacing={1}>
            <div id="init_val">
              <p>Initial Values</p>
              <InitialValues />
            </div>
            </Grid>
            <Grid container spacing={1}>
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
            </div></Grid>
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
    color: '#ffffff',
  },
}));

/**
 * Setup for the buttons and their onclick methods
 * 
 * @returns the group of buttons
 */
function ButtonsGroup() {
  return (
    <div>
      <Grid item >
        <Button className={useStyles().state_button} onClick={addNodeClick} id="AddNode"> Add Node</Button>
        <Button className={useStyles().state_button} onClick={addConnectionClick} id="AddConnection"> Add Connection</Button>
        <Button className={useStyles().state_button} onClick={removeNodeClick} id="RemoveNode"> Remove Node</Button>
        <Button className={useStyles().state_button} onClick={removeConnectionClick} id="RemoveConnection" disabled> Remove Connection (DISABLED)</Button>
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
/**
 * Changes the selected button to add node, if it is already selected it is cleared
 */
function addNodeClick() {
  if (buttonChecked == button_options.ADDNODE) {
    buttonChecked = button_options.NONE;
  }
  else {
    buttonChecked = button_options.ADDNODE;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}
/**
 * Changes the selected button to remove node, if it is already selected it is cleared
 */
function removeNodeClick() {
  if (buttonChecked == button_options.REMOVENODE) {
    buttonChecked = button_options.NONE;
  }
  else {
    buttonChecked = button_options.REMOVENODE;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}
/**
 * This handles the input choice of adding a connection
 */
function addConnectionClick() {
  if (buttonChecked == button_options.ADDCONNECT) {
    buttonChecked = button_options.NONE;
  }
  else {
    buttonChecked = button_options.ADDCONNECT;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}

/**
 * this calls the method for removing a connection
 */
function removeConnectionClick() {
  if (buttonChecked == button_options.REMOVECONNECT) {
    buttonChecked = button_options.NONE;
  }
  else {
    buttonChecked = button_options.REMOVECONNECT;
  }
  consoleAdd("Button Selected: " + buttonChecked);
}

/**
 * This handles the input mode for moving a node
 */
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

/**
 * handles pressing the input button for creating a sender reciver pair
 */
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
/**
 * Handles pressing the left input button for inspecting a node
 */
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

/**
 * This funciton will clear all of the console, globals, and the objects from the scene
 */
function clear() {
  consoleClear();
  buttonChecked = button_options.NONE;
  clearGlobals();
  while(scene.children.length > 0){  //removes all children from the scene
    scene.remove(scene.children[0]); 
  }
}

/**
 * This will clear any global variables so that they will not impact the program's next run
 */
function clearGlobals() {
  invConnMap.clear();
  SndRecArray =[];
  tweenArr = []

}

//Initial Values variables.
var Switching_Method;
var TransDelay;
var MsgLength;
var TransRate;
var CircSetupTime;
var HeaderSize;
var PktSize;
var PktRoutingDelay;

var totalMessageTime;
//SenderReciver pairs
var SndRecArray = [];


var tweenArr = [];
var circMessageTimePerJump;
var totalSwitchTime;

/**
 * Method for starting circuit siwthcing for all sender receiver pairs
 */
function startCircuitSw() {
  //findbest route
  totalMessageTime = ((MsgLength / TransRate) + TransDelay) * 1000;
  totalSwitchTime = totalMessageTime + CircSetupTime;
  for (let index = 0; index < SndRecArray.length; index++) {
    const pair = SndRecArray[index];

    if (index == 0) {
      startIndSw(pair);
    }
    else {
      setTimeout(() => { startIndSw(pair) }, totalSwitchTime * index);
    }

  }
}

/**
 * This performs the circuit swithcing for each indiviual sender receiver pairs
 * 
 * @param {*} pair The sender receiver to perform this on
 */
function  startIndSw(pair) {
  var chosenRoute = findBestRoute(pair); //output chosen route
  consoleAdd("ChosenRoute: " + chosenRoute)
  var connArray = [];


  for (let index = 0; index < chosenRoute.length - 1; index++) {
    const element = chosenRoute[index];
    var nodeObj = nodeMap.get(element);
    var next = nodeMap.get(chosenRoute[index + 1]);
    for (let value of connectionMap.values()) {
      if ((nodeObj == value.fromNode) && (next == value.toNode)) { //the connection is not inverted
        connArray.push(value);
        invConnMap.set(value, false);
      } else if ((nodeObj == value.toNode) && (next == value.fromNode)) {
        connArray.push(value); //the conneciton is inverted
        invConnMap.set(value, true);
      }
    }

  }

  circMessageTimePerJump = totalMessageTime / connArray.length;
  var message;
  setupConnection(pair, connArray, CircSetupTime);
  setTimeout(() => { message = createMessage(pair, connArray) }, CircSetupTime);
  setTimeout(() => { breakdownConnection(pair, connArray); scene.remove(message)}, totalSwitchTime);
  
}

/**
 * Finds the best route by calling the findRoutes method
 * 
 * @param {*} sendRecPair The sender receiver pairs to find the  routes between
 * @returns The best route
 */
function findBestRoute(sendRecPair) {

  var routes = findRoutes(sendRecPair);
  var shortestSteps = 0;
  var bestRoute = [];

  routes.sort(function (a, b) {
    return a.length - b.length;
  })
  bestRoute = routes[0];
  return bestRoute;
}
/**
 * THis is used to clone an object due to an issue with javascript object references
 * 
 * @param {*} A the array object to be copied
 * @returns A copy of the array which was provided
 */
function clone(Array) {
  return JSON.parse(JSON.stringify(Array));
}
  
var invConnMap = new Map;

/**
 * THis is the function which calls the a recusive function to reutnr all of the routes from sender to receiver
 * built and refined from the java example at: https://www.geeksforgeeks.org/find-paths-given-source-destination/
 * 
 * @param {*} sendRecPair the pair of sender and receiver
 * @returns all routes from sender to receiver
 */
function findRoutes(sendRecPair) {
  var start = sendRecPair.sender;
  var end = sendRecPair.reciever;
  var isVisited = new Map();
  var pathList = [start.name];
  var routes = [];
  /**
   * This is the recursive loop for finding each route
   * 
   * @param {*} currentNode current node to check
   * @param {*} destinationNode the goal node
   * @param {*} isVisited a map of nodes names to if they are visited for not
   * @param {*} local this is the array holding the path local to each
   * @returns all found routes
   */
  function findRoutesRec(currentNode, destinationNode, isVisited, local) {
    var otherNode;
    var found;
    //base case for finding the destination node
    if (currentNode == destinationNode) {
      var currentRoute = clone(local);
      routes.push(currentRoute);
      return routes;
    }
    isVisited.set(currentNode.name, true);
    currentNode.getConnectionArr().forEach(connection => {
      //finds out which node in the connection is the current node and saves the other

      if (connection.fromNode == currentNode) {
        otherNode = connection.toNode;
      }
      else {
        otherNode = connection.fromNode;
      }
      //if the node hasnt yet been visited, add the new node and recurse.
      if (!isVisited.get(otherNode.name)) {
        local.push(otherNode.name);
        found = findRoutesRec(otherNode, destinationNode, isVisited, local);
        local.pop();
        return routes;
      }
    }
    );
    isVisited.set(currentNode.name, false);
  }
  findRoutesRec(start, end, isVisited, pathList );
  return routes;
}
/**
 * Sets up the connection, highlighting the route
 * 
 * @param {*} pair The sender receiver pair to be performed on
 * @param {*} route The route to setup along
 * @param {*} setupTime The amount of time that it will take
 * @returns 
 */
function setupConnection(pair, route, setupTime) { 
  var timeForEach = (setupTime / route.length);
  for (let index = 0; index < route.length; index++) {
    const connection = route[index];
    if (index == 0) {
      setupEach(pair, connection)

    }
    else {
      setTimeout(() => {
        setupEach(pair, connection)
      }, timeForEach);
    }
  }

  consoleAdd("Route setup");
  return;
}
/**
 * This performs the setup for each connection
 * 
 * @param {*} pair sender receiver pair it is on
 * @param {*} connection the connection to perform it on
 */
function setupEach(pair, connection) {
  connection.connectorObj.material.color.set(0xF2E9AF);
  var currentConObj = connectionMap.get(connection.connectorObj.name);
  currentConObj.use();
  if ((connection.fromNode != pair.sender) && (connection.fromNode != pair.reciever)) {

    connection.fromNode.circleObject.material.color.set(0xF2E9AF);
    connection.fromNode.use();

  }
  if ((connection.toNode != pair.sender) && (connection.toNode != pair.reciever)) {
    connection.toNode.circleObject.material.color.set(0xF2E9AF);
    connection.toNode.use();
  }
}
/**
 * Used to breakdown the connection after a message has been sent
 * 
 * @param {*} pair the sender and receiver pair
 * @param {*} route the route of connections
 * @returns 
 */
function breakdownConnection(pair, route) {
  for (let index = route.length - 1; index >= 0; index--) {
    const connection = route[index];
    if (index == route.length - 1) {
      breakEach(pair, connection)

    }
    else {
      setTimeout(() => {
        breakEach(pair, connection)
      }, (CircSetupTime / route.length));
    }
  }
  consoleAdd("Connection broke down");
  tweenArr = []
  return;
}
/**
 * Breaks down for each connection
 * 
 * @param {*} pair the sender and receiver pair
 * @param {*} connection The current connections
 */
function breakEach(pair, connection) {
  connection.connectorObj.material.color.set(0xFFFFFF);
  var currentConObj = connectionMap.get(connection.connectorObj.name);
  currentConObj.finished();
  if ((connection.fromNode != pair.sender) && (connection.fromNode != pair.reciever)) {

    connection.fromNode.circleObject.material.color.set(0xF2AFAF);
    connection.fromNode.finished();

  }
  if ((connection.toNode != pair.sender) && (connection.toNode != pair.reciever)) {
    connection.toNode.circleObject.material.color.set(0xF2AFAF);
    connection.toNode.finished()
  }
}
/**
 * This creates the message and sets up the message for each connection
 * 
 * @param {*} sndRec the sender and receiver pair
 * @param {*} route The routem to be taken
 * @returns the message object
 */
function createMessage(sndRec, route) {
  var startNode = sndRec.sender.circleObject;
  var validLength;
  if(MsgLength > 1800){
    validLength = 1800
  }
  else{
    validLength = MsgLength
  }
  const geometry = new THREE.PlaneGeometry(validLength / 10000, .015, 32); //MsgLength / 10000
  const material = new THREE.MeshBasicMaterial({ color: 0xAFF2F0, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);

  plane.position.set(startNode.position.x, startNode.position.y, 0.95);
  scene.add(plane);//radians change to
  for (let i = 0; i < route.length; i++) {
    var inverted = false;
    const connection = route[i];
    if (!invConnMap.get(connection)) {
      var position = { x: connection.fromNode.circleObject.position.x, y: connection.fromNode.circleObject.position.y };
      var target = { x: connection.toNode.circleObject.position.x, y: connection.toNode.circleObject.position.y };
    }
    else {
      inverted = true;
      var target = { x: connection.fromNode.circleObject.position.x, y: connection.fromNode.circleObject.position.y };
      var position = { x: connection.toNode.circleObject.position.x, y: connection.toNode.circleObject.position.y };
    }
    setupMessage(plane, position, target, inverted);
    consoleAdd("sending message from node: " + connection.fromNode.name + " to " + connection.toNode.name);
  }

  tweenArr[0].start();
  return plane;
}
/**
 * This will setupd the tweens for each message and chain them to eachother
 * 
 * @param {*} message the message object 
 * @param {*} position The position to send from
 * @param {*} target THe position to send to
 * @param {*} invert wether or not the connection was inverted
 * @returns the message object
 */
function setupMessage(message, position, target, invert) {


  var tween = new TWEEN.Tween(position).to(target, circMessageTimePerJump); //2000 == 2s needs changing (propagation delay)
  var tweenRot = new TWEEN.Tween(message.rotation).to({ z: Math.atan2(position.y - target.y, position.x - target.x) }, 0);


  tween.onUpdate(() => {
    message.position.x = position.x;
    message.position.y = position.y;

  });
  tween.onStart(() => {
    if (invert) {
      message.rotateZ(Math.atan2(position.y - target.y, position.x - target.x));
    }
    else {
      message.rotateZ(Math.atan2(target.y - position.y, target.x - position.x));
    }

  })

  if (tweenArr.length == 0) {
    tween.chain(tweenRot);
    tweenArr.push(tween);
  }
  else {
    tweenArr[tweenArr.length - 1].chain(tween, tweenRot);
    tweenArr.push(tween);
  }
  return message;
}
/**
 * Creates the information for each packet
 * 
 * @param {*} pair the sender and receiver pair
 * @param {*} method wether it is virtual circuit or datagram
 * @returns 
 */
function createPacketInfo(pair, method) {
  var fullPackets;
  var remainingData;
  var numberOfPackets = 1;
  var packets = [];
  var dataSize = PktSize - HeaderSize

  fullPackets = Math.floor(MsgLength / (dataSize));
  remainingData = MsgLength % (dataSize);
  var totalPackets = fullPackets + 1
  //creates the full packets
  for (let index = 0; index < fullPackets; index++) {
    var created = createPacket(numberOfPackets, pair, dataSize, totalPackets);
    numberOfPackets++
    packets.push(created)
  }
  //remaining packet
  var remainingPkt = createPacket(totalPackets, pair, remainingData, totalPackets)
  packets.push(remainingPkt);

  var totalTime;
  var noPackets = packets.length;
  var timeForEach;
  if (method == "VC") {
    totalTime = CircSetupTime + ((MsgLength + (noPackets * HeaderSize)) / TransRate) + TransDelay
  }
  else {
    totalTime = (noPackets * PktRoutingDelay) + ((MsgLength + (noPackets * HeaderSize)) / TransRate) + TransDelay
    timeForEach = PktRoutingDelay + ((MsgLength + (noPackets * HeaderSize)) / TransRate)
  }
  //returns as an object with the packets array and the time calculation
  return { p: packets, time: totalTime * 1000, timeE: timeForEach * 1000 };
}
const MAX_PACKET_SIZE = 900
/**
 * This will create the individual packet
 * 
 * @param {*} packetNo the number of this packet
 * @param {*} pair the sender and receiver pair
 * @param {*} dataSize size of the data for this object
 * @param {*} totalNo total number of packets
 * @returns the packet object
 */
function createPacket(packetNo, pair, dataSize, totalNo) {
  var validPkt, validHead
  
  if(PktSize > MAX_PACKET_SIZE){
    validPkt = MAX_PACKET_SIZE 
    validHead = (HeaderSize / PktSize) * MAX_PACKET_SIZE
  }
  else{
    validPkt = PktSize
    validHead = HeaderSize
  }
  const geometryP = new THREE.PlaneGeometry(validPkt / 5000, .015, 32, 32); 
  const geometryH = new THREE.PlaneGeometry(validHead / 5000, .015, 32, 32);
  const materialP = new THREE.MeshBasicMaterial({ color: 0xAFF2F0, side: THREE.DoubleSide });
  const materialH = new THREE.MeshBasicMaterial({ color: 0xE7AFF2, side: THREE.DoubleSide });
  var startNode = pair.sender.circleObject;
  var destination = pair.reciever.circleObject;

  //Creates the header and packet as separate objects
  const data = new THREE.Mesh(geometryP, materialP);
  const header = new THREE.Mesh(geometryH, materialH);
  const packet = new THREE.Group();
  packet.add(data)
  packet.add(header)
  packet.position.set(startNode.position.x, startNode.position.y, 0.95);
  scene.add(packet);


  return new Packet(packetNo, PktSize, HeaderSize, dataSize, packet, startNode, pair.reciever, totalNo);
}
var packetRecieved = new Map
/**
 * Sends a packet for datagram packet switching
 * 
 * @param {*} packet The packet
 * @param {*} connection the connection it is on
 * @param {*} inv wehter it is inverted or not
 * @param {*} totalPackets total number of packets
 */
function sendPacketDG(packet, connection, inv, totalPackets) {
  //consider inversion
  if (!inv) {
    var position = { x: connection.fromNode.circleObject.position.x, y: connection.fromNode.circleObject.position.y };
    var target = { x: connection.toNode.circleObject.position.x, y: connection.toNode.circleObject.position.y };
  }
  else {
    var target = { x: connection.fromNode.circleObject.position.x, y: connection.fromNode.circleObject.position.y };
    var position = { x: connection.toNode.circleObject.position.x, y: connection.toNode.circleObject.position.y };
  }
  var tween = new TWEEN.Tween(packet.object.position).to(target, PktSize / TransRate * 1000); //2000 == 2s needs changing (propagation delay)
  var tweenRot = new TWEEN.Tween(packet.object.rotation).to({ z: Math.atan2(position.y - target.y, position.x - target.x) }, 0);


  //moves the header and packet together
  tween.onComplete(() => {
    var currentNode, originalNode;
    if (inv) {
      currentNode = connection.fromNode
      originalNode = connection.toNode

    }
    else {
      currentNode = connection.toNode
      originalNode = connection.fromNode
    }
    originalNode.dequeue();
    connection.finished();
    var found = bestConn(currentNode, packet.destinationNode.name);
    if (typeof found !== 'undefined') {


      setTimeout(() => sendPacketDG(packet, found.conn, found.invert, totalPackets), PktRoutingDelay * 1000);
    }
    else if (currentNode == packet.destinationNode) {
      consoleAdd("packet " + packet.packetNumber + " has reached the destination node")
      packetRecieved.get()
      if (packet.packetNumber == totalPackets) {
        consoleAdd("final packet recieved");
      }
      scene.remove(packet.object)

    }


  })
  tween.onStart(() => {
    var currentNode;
    var validHead, validPkt
    tweenRot.start();
    if(PktSize > MAX_PACKET_SIZE){
      validPkt = MAX_PACKET_SIZE 
      validHead = (HeaderSize / PktSize) * MAX_PACKET_SIZE
    }
    else{
      validPkt = PktSize
      validHead = HeaderSize
    }
    packet.object.children[1].position.x = packet.object.children[0].position.x - validPkt / 10000; //Positions the header at the end of the packet
    if (inv) {
      currentNode = connection.fromNode
    }
    else {
      currentNode = connection.toNode
    }
    connection.use();
    currentNode.enqueue(currentNode);
  }
  );
  tween.start();
}
/**
 * tells each node to create its routing table, and starts packet switching for datagram
 */
function startPktSwitchDG() {
  for (let i = 0; i < SndRecArray.length; i++) {
    (function (j) {
      const pair = SndRecArray[i];
      var routes = findRoutes(pair);
      routes.sort(function (a, b) {
        return a.length - b.length;
      })
      var destination = pair.reciever.name;
      for (let index = 0; index < routes.length; index++) { //each route from sender to reciver
        const eachRoute = routes[index];
        for (let i = 0; i < eachRoute.length; i++) { //each node in that route

          var node = eachRoute[i]
          var steps = eachRoute.length - i - 1;
          var nodeObj = nodeMap.get(node);
          var next = nodeMap.get(eachRoute[i + 1]);
          for (let value of nodeObj.getConnectionArr()) { //Each connection from that node
            if ((nodeObj == value.fromNode) && (next == value.toNode)) { //the connection is not inverted
              nodeObj.addRouteToTable(destination, steps, value, false)
            } else if ((nodeObj == value.toNode) && (next == value.fromNode)) {
              nodeObj.addRouteToTable(destination, steps, value, true)
            }
          }
        }
      }
      var packetInfo = createPacketInfo(pair, "DG");
      var totalTime = packetInfo.time
      var packets = packetInfo.p
      for (let index = 0; index < packets.length; index++) {
        (function (i) {
          const packet = packets[index];


          setTimeout(() => {
            var found = bestConn(pair.sender, pair.reciever.name)
            if (typeof found !== 'undefined') {
              consoleAdd("sending packet " + packet.packetNumber)
              sendPacketDG(packet, found.conn, found.invert, packets.p - 1)
            }
          }, (PktRoutingDelay * 1000 * index) + TransDelay * 1000)
        })(index)


      }


    })(i)
  }
}
/**
 * choses the best connection from the routing table
 * 
 * @param {*} node the node which they are currently at
 * @param {*} rec the receiver node
 * @returns returns the choice or the first route
 */
function bestConn(node, rec) {
  for (let index = 0; index < node.routesTo(rec).length; index++) {
    const choice = node.routesTo(rec)[index];
    if (!choice.conn.inUse) {
      return choice
    }

  }
  return node.routesTo(rec)[0];

}
/**
 * Starts packet switching for virtual circuit
 */
function startPktSwitchVC() {
  //choses the best route using the same method as circuit switch
  for (let j = 0; j < SndRecArray.length; j++) {
    (function (index) {
      const pair = SndRecArray[j];
      var chosenRoute = findBestRoute(pair); //output chosen route
      consoleAdd("ChosenRoute: " + chosenRoute)
      var connArray = [];
      //Takes the found best route, and finds the connections corresponding to them
      for (let index = 0; index < chosenRoute.length - 1; index++) {
        const element = chosenRoute[index];
        var nodeObj = nodeMap.get(element);
        var next = nodeMap.get(chosenRoute[index + 1]);
        for (let value of connectionMap.values()) {
          if ((nodeObj == value.fromNode) && (next == value.toNode)) { //the connection is not inverted
            connArray.push(value);
            invConnMap.set(value, false);
          } else if ((nodeObj == value.toNode) && (next == value.fromNode)) {
            connArray.push(value); //the conneciton is inverted
            invConnMap.set(value, true);
          }
        }
      }
      var packetsData = createPacketInfo(pair, "VC");
      var packets = packetsData.p;
      var totalTime = packetsData.time;

      setupConnection(pair, connArray, CircSetupTime * 1000);
      setTimeout(() => sendPacketsVC(pair, connArray, packetsData), CircSetupTime * 1000);
    })(j)

  }
}
/**
 * Sends each packet from the start node
 * 
 * @param {*} sndRec the sender and receiver pair
 * @param {*} route the route to be taken
 * @param {*} packets the array of packets with data
 */
function sendPacketsVC(sndRec, route, packetsData) {
  var timeForEach = packetsData.time / route.length;
  //Go through each packet in the Q
  for (let index = 0; index < packetsData.p.length - 1; index++) {
    (function (i) {
      const packet = packetsData.p[index]
      setTimeout(() => { createSendPacket(sndRec, route, packet, timeForEach, route, packetsData.p.length - 1) }, (timeForEach * index));
    })(index)
  }

}
/**
 * This creates the tweens for the packet and uses the routing table to chose its next connection
 * 
 * @param {*} sndRec the sender and receiver pair
 * @param {*} route the route to take
 * @param {*} packet the packet object
 * @param {*} time for each transfer
 * @param {*} wholeRoute the whole route to be taken
 * @param {*} totalPackets 
 */
function createSendPacket(sndRec, route, packet, time, wholeRoute, totalPackets) {
  var connection = route[0];
  var inverted;

  if (!invConnMap.get(connection)) {
    inverted = false;
    var position = { x: connection.fromNode.circleObject.position.x, y: connection.fromNode.circleObject.position.y };
    var target = { x: connection.toNode.circleObject.position.x, y: connection.toNode.circleObject.position.y };
  }
  else {
    inverted = true;
    var target = { x: connection.fromNode.circleObject.position.x, y: connection.fromNode.circleObject.position.y };
    var position = { x: connection.toNode.circleObject.position.x, y: connection.toNode.circleObject.position.y };
  }

  var tween = new TWEEN.Tween(packet.object.position).to(target, time); //2000 == 2s needs changing (propagation delay)
  var tweenRot = new TWEEN.Tween(packet.object.rotation).to({ z: Math.atan2(position.y - target.y, position.x - target.x) }, 0);


  tween.onComplete(() => {
    //find what node we are at, 
    var currentNode;

    //join q setTimeout
    if (route.length == 1) {
      consoleAdd("packet " + packet.packetNumber + " has reached the destination node")
      if (packet.packetNumber == totalPackets) {
        consoleAdd("final packet recieved");
        breakdownConnection(sndRec, wholeRoute)
      }
      scene.remove(packet.object);
    }
    else {
      var newRoute = route.slice()
      newRoute.shift()
      if (newRoute.length != 0) {
        if (inverted) {
          currentNode = connection.fromNode
        }
        else {
          currentNode = connection.toNode
        }
        currentNode.enqueue(packet);
        createSendPacket(sndRec, newRoute, packet, time, wholeRoute, totalPackets)
      }

    }
  })
  tween.onStart(() => {
    var currentNode;
    tweenRot.start();
    packet.object.children[1].position.x = packet.object.children[0].position.x - PktSize / 10000;
    //find what node we are at, dequeue
    if (inverted) {
      currentNode = connection.fromNode
    }
    else {
      currentNode = connection.toNode
    }
    currentNode.dequeue();

  })
  tween.start();
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
  const GRAY = grey[500]
  const WHITE = grey[0]
/**
 * 
 * @param {*} event 
 */
  const handleChange = (event) => {
    setMethod(event.target.value);
    Switching_Method = event.target.value;

    //if circuit enable - circuit setup disable - header, packet, routing delay
    if (Switching_Method == "Circuit") {
      document.getElementById("text_Circuit_Setup").disabled = false;
      document.getElementById("text_Circuit_Setup").style.color = WHITE;


      document.getElementById("text_Header_Size").disabled = true;
      document.getElementById("text_Header_Size").style.color = GRAY;

      document.getElementById("text_Packet_Size").disabled = true;
      document.getElementById("text_Packet_Size").style.color = GRAY;

      document.getElementById("text_Routing_Delay").disabled = true;
      document.getElementById("text_Routing_Delay").style.color = GRAY;
    }
    else if (Switching_Method == "Datagram") {    //if packet either  enable - header, packet, routing delay disable - circuit setup
      document.getElementById("text_Circuit_Setup").disabled = true;
      document.getElementById("text_Circuit_Setup").style.color = GRAY;


      document.getElementById("text_Header_Size").disabled = false;
      document.getElementById("text_Header_Size").style.color = WHITE;

      document.getElementById("text_Packet_Size").disabled = false;
      document.getElementById("text_Packet_Size").style.color = WHITE;

      document.getElementById("text_Routing_Delay").disabled = false;
      document.getElementById("text_Routing_Delay").style.color = WHITE;
    }
    else {
      document.getElementById("text_Circuit_Setup").disabled = false;
      document.getElementById("text_Circuit_Setup").style.color = WHITE;

      document.getElementById("text_Header_Size").disabled = false;
      document.getElementById("text_Header_Size").style.color = WHITE;

      document.getElementById("text_Packet_Size").disabled = false;
      document.getElementById("text_Packet_Size").style.color = WHITE;

      document.getElementById("text_Routing_Delay").disabled = true;
      document.getElementById("text_Routing_Delay").style.color = GRAY;
    }
  }
  /**
   * This checks to see if the values are valid
   * 
   * @returns if the input is valid
   */
  function validateInput() {
    inputIssues = ""
    var result = true;
    if (Switching_Method) {
      if (SndRecArray.length != 0) {
        //Inputs that are used for both
        if ((isNaN(TransDelay))) {
          result = false;
          inputIssues += inputIssues + "Transfer Delay is Invalid, "
        }
        if ((isNaN(MsgLength))) {
          result = false;
          inputIssues += "Message Length is Invalid, "
        }
        if ((isNaN(TransRate))) {
          result = false;
          inputIssues += "Transmission Rate is Invalid, "
        }

        //Inputs for circuit switching
        if (Switching_Method == "Circuit") {
          if ((isNaN(CircSetupTime))) {
            result = false;
            inputIssues += "Circuit Setup Time is Invalid, "
          }
        }
        //Inputs for packet switching
        else {

          if ((isNaN(PktSize))) {
            result = false;
            inputIssues += "Packet Size is Invalid, "
          }
          if ((isNaN(HeaderSize)) || (HeaderSize > PktSize)) {
            result = false;
            inputIssues += "Header Size is Invalid, "
          }
          if ((isNaN(PktRoutingDelay))) {
            result = false;
            inputIssues += "Packet Routing Delay is Invalid, "
          }
        }
        return result;
      }
      else {
        inputIssues += "No sender reciver pairs found, "
        return false;
      }
    }

    else {
      inputIssues += "No method chosen, "
      return false;
    }
  }
  var inputIssues;
  /**
   * Starts the animation and sets the inputs
   */
  const animateSimulation = () => {
    //take all values from below and 
    TransDelay = Number(document.getElementById("text_Trans_Delay").value);
    MsgLength = Number(document.getElementById("text_Msg_Length").value);
    TransRate = Number(document.getElementById("text_Transmission_Rate").value);
    CircSetupTime = Number(document.getElementById("text_Circuit_Setup").value)
    HeaderSize = Number(document.getElementById("text_Header_Size").value);
    PktSize = Number(document.getElementById("text_Packet_Size").value);
    PktRoutingDelay = Number(document.getElementById("text_Routing_Delay").value);

    if (validateInput()) {
      switch (Switching_Method) {
        case "Circuit":
          CircSetupTime = Number(document.getElementById("text_Circuit_Setup").value) * 1000;
          startCircuitSw();
          break;
        case "Datagram":
          HeaderSize = Number(document.getElementById("text_Header_Size").value);
          PktSize = Number(document.getElementById("text_Packet_Size").value);
          PktRoutingDelay = Number(document.getElementById("text_Routing_Delay").value);
          startPktSwitchDG();
          break;
        case "VirtualCircuit":
          HeaderSize = Number(document.getElementById("text_Header_Size").value);
          PktSize = Number(document.getElementById("text_Packet_Size").value);
          CircSetupTime = Number(document.getElementById("text_Circuit_Setup").value);
          startPktSwitchVC();
          break;
        default:
          consoleAdd("Not a valid switching method")
          break;

      }
    }
    else {
      consoleAdd("Issues with the inputs: " + inputIssues)
    }


  }

  return (
    <div id="initial_container">
      <InputLabel id="lbl_Sw_Method" className={classes.label} >Switching Method</InputLabel>
      <Select fullWidth labelId="lbl_Sw_Method" id="select_Sw_Method" value={method} onChange={handleChange} margin="dense" inputProps={{ className: classes.initVal }} >
        <MenuItem value="Circuit">Circuit Switching</MenuItem>
        <MenuItem value="Datagram">Packet Switching - Datagram</MenuItem>
        <MenuItem value="VirtualCircuit">Packet Switching - Virtual Circuit</MenuItem>
      </Select>
      <TextField fullWidth id="text_Trans_Delay" label="Transfer Delay (secs)" variant="outlined" margin="dense" className={classes.initVal} defaultValue="10" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Msg_Length" label="Message Length (bits)" variant="outlined" margin="dense" className={classes.initVal} defaultValue="1000" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Transmission_Rate" label="Transmission Rate (bits/sec)" variant="outlined" margin="dense" className={classes.initVal} defaultValue="200" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Circuit_Setup" label="Circuit Setup Time (secs)" variant="outlined" margin="dense" className={classes.initVal} disabled defaultValue="4" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Header_Size" label="Header Size (bits)" variant="outlined" margin="dense" className={classes.initVal} disabled defaultValue="50" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Packet_Size" label="Packet Size (bits)" variant="outlined" margin="dense" className={classes.initVal} disabled defaultValue="200" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Routing_Delay" label="Packet Routing Delay (secs)" variant="outlined" margin="dense" className={classes.initVal} disabled defaultValue="1" inputProps={{ className: classes.initVal }} />
      <Button variant="contained" className={classes.animate} onClick={animateSimulation}>Animate</Button>

    </div>
  )
}



/**
 * Console functions to add and clear to the console on the right hand side, providing updates to the user on internal functions
 * 
 */
function consoleClear() {
  //Get document text and clear
  document.getElementById("consoleText").value = "";
}
function consoleAdd(toAdd) {
  document.getElementById("consoleText").value = ">> " + toAdd + "\n" + document.getElementById("consoleText").value;
}

export default InteractiveBuilder;