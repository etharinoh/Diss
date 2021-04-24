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
    color: '#ffffff',
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

var totalMessageTime;
//SenderReciver pairs
var SndRecArray = [];
var tweenArr = [];
var chosenRoute = [];
var circMessageTimePerJump;
function startCircuitSw() {
  //findbest route
  SndRecArray.forEach(pair => {
    chosenRoute = findBestRoute(pair); //output chosen route
    consoleAdd("ChosenRoute: " + chosenRoute)
    console.log(chosenRoute); //TODO need to use the set of points to find their corresponding connections
    var connArray = [];



    for (let index = 0; index < chosenRoute.length - 1; index++) {
      const element = chosenRoute[index];
      var nodeObj = nodeMap.get(element);
      var next = nodeMap.get(chosenRoute[index + 1]);
      for (let value of connectionMap.values()) {
        if ((nodeObj == value.fromNode) && (next == value.toNode)) {
          connArray.push(value);
          invConnMap.set(value, false);
        } else if ((nodeObj == value.toNode) && (next == value.fromNode)) {
          connArray.push(value);
          invConnMap.set(value, true);
        }
      }

    }
    totalMessageTime = MsgLength / (TransRate * connArray.length);
    totalMessageTime = totalMessageTime * 1000;
    circMessageTimePerJump = totalMessageTime / connArray.length;
    console.log(totalMessageTime);
    let setupPromise = new Promise((resolve, reject) => {
      setupConnection(pair, connArray);
      setTimeout(() => { createMessage(pair, connArray) }, CircSetupTime * 1000);
      setTimeout(() => { breakdownConnection(pair, connArray) }, totalMessageTime + (CircSetupTime * 1000));
    });
    //Reset eveything
    allRoutes = [];
  });

  //Get all the connection objects and change their color to 
}
function findBestRoute(sendRecPair) {

  findRoutes(sendRecPair);
  var shortestSteps = 0;
  var bestRoute = [];

  allRoutes.forEach(function (route) {
    if (bestRoute.length == 0) {
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
function clone(A) {
  return JSON.parse(JSON.stringify(A));
}
var invConnMap = new Map;
function findRoutes(sendRecPair) {
  var start = sendRecPair.sender;
  var end = sendRecPair.reciever;
  var isVisited = new Map();
  var pathList = [start.name];
  var routes = [];
  function findRoutesRec(currentNode, destinationNode, isVisited, local, myArray = [[]]) {
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
      else {
        otherNode = connection.fromNode;
      }

      if (!isVisited.get(otherNode.name)) {
        local.push(otherNode.name);
        found = findRoutesRec(otherNode, destinationNode, isVisited, local, myArray);
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
function setupConnection(pair, route) { //circuit setuptime / Amount of stops in route
  var timeForEach = (CircSetupTime / route.length) * 1000;
  for (let index = 0; index < route.length; index++) {
    setTimeout(() => {
      const connection = route[index];
      connection.connectorObj.material.color.set(0xF2E9AF);
      var currentConObj = connectionMap.get(connection.connectorObj.name);
      currentConObj.use();
      if ((connection.fromNode != pair.sender) && (connection.fromNode != pair.reciever)) {

        connection.fromNode.circleObject.material.color.set(0xF2E9AF);

      }
      if ((connection.toNode != pair.sender) && (connection.toNode != pair.reciever)) {
        connection.toNode.circleObject.material.color.set(0xF2E9AF);
      }
    }, timeForEach);
  }
  consoleAdd("Route setup");
  return;
}
async function breakdownConnection(pair, route) {
  for (let index = 0; index < route.length; index++) {
    const connection = route[index];
    console.log(connection);
    connection.connectorObj.material.color.set(0xFFFFFF);
    var currentConObj = connectionMap.get(connection.connectorObj.name);
    currentConObj.finished();
    if ((connection.fromNode != pair.sender) && (connection.fromNode != pair.reciever)) {

      connection.fromNode.circleObject.material.color.set(0xF2AFAF);

    }
    if ((connection.toNode != pair.sender) && (connection.toNode != pair.reciever)) {
      connection.toNode.circleObject.material.color.set(0xF2AFAF);
    }
  }
  consoleAdd("Connection broke down");
  tweenArr = [];
  return;
}
var allRoutes = [];
var routesFound = 0;
var complete = false;

async function createMessage(sndRec, route) {
  complete = false;
  var startNode = sndRec.sender.circleObject;
  const geometry = new THREE.PlaneGeometry(MsgLength / 1000, .015, 32); //MsgLength / 10000
  const material = new THREE.MeshBasicMaterial({ color: 0xAFF2F0, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);

  plane.position.set(startNode.position.x, startNode.position.y, 0.95);
  console.log(plane.position);
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
    sendMessage(plane, position, target, inverted);
    console.log("finished");
    consoleAdd("sending message from node: " + connection.fromNode.name + " to " + connection.toNode.name);
  }

  complete = false;
  tweenArr[0].start();
  return;
}
function sendMessage(message, position, target, invert) {

  console.log(position, target);
  var tween = new TWEEN.Tween(position).to(target, circMessageTimePerJump); //2000 == 2s needs changing (propagation delay)



  tween.onUpdate(() => {
    message.position.x = position.x;
    message.position.y = position.y;

  }
  );
  tween.onComplete(() => {
    if (invert) {
      message.rotateZ(Math.atan2(position.y - target.y, position.x - target.x));
    }
    else {
      message.rotateZ(Math.atan2(target.y - position.y, target.x - position.x));
    }
  })
  tween.onStart(() => {


  })

  if (tweenArr.length == 0) {
    tweenArr.push(tween);
  }
  else {
    tweenArr[tweenArr.length - 1].chain(tween);
    tweenArr.push(tween);
  }
  console.log(tweenArr);
  return;
  //use tween.delay(); for (packet routing delay)
}
function createPacketInfo(pair){
  var fullPackets;
  var remainingPacket;
  var numberOfPackets=1;
  var packets=[];
  var dataSize = PktSize - HeaderSize
  const geometry = new THREE.PlaneGeometry(1, .015, 32); //MsgLength / 10000
  const material = new THREE.MeshBasicMaterial({ color: 0xAFF2F0, side: THREE.DoubleSide , vertexColors: THREE.VertexColors});

  fullPackets = Math.floor(MsgLength/(dataSize));
  remainingPacket = MsgLength % (dataSize);
  console.log(fullPackets, remainingPacket);

  //creates the full packets
  for (let index = 0; index < fullPackets; index++) {
    var startNode = pair.sender.circleObject;
    var destination = pair.reciever.circleObject;
  
    
    
    var cols = [{
      stop: 0,
      color: new THREE.Color(0xAFF2F0)
    }, {
      stop: (HeaderSize / PktSize),
      color: new THREE.Color(0xDCAFF2)
    }];
    var gradient = geometry.attributes.
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( cols, 2 ) );
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0,0,0.95);
    
    scene.add(plane);
    var newPkt = new Packet(numberOfPackets, PktSize,HeaderSize,dataSize,plane,startNode,destination);
    packets.push(newPkt);
    console.log(HeaderSize / PktSize, plane);
  }}
  /**
   * This is a function for applyuing a colour gradient to a geomertry for threejs:
   * Taken from: https://stackoverflow.com/questions/52614371/apply-color-gradient-to-material-on-mesh-three-js
   * @param {*} geometry 
   * @param {*} colors 
   * @param {*} axis 
   * @param {*} reverse 
   */
  function setGradient(geometry, colors, axis, reverse) {

    geometry.computeBoundingBox();
  
    var bbox = geometry.boundingBox;
    var size = new THREE.Vector3().subVectors(bbox.max, bbox.min);
  
    var vertexIndices = ['a', 'b', 'c'];
    var face, vertex, normalized = new THREE.Vector3(),
      normalizedAxis = 0;
  
    for (var c = 0; c < colors.length - 1; c++) {
  
      var colorDiff = colors[c + 1].stop - colors[c].stop;
  
      for (var i = 0; i < geometry.faces.length; i++) {
        face = geometry.faces[i];
        for (var v = 0; v < 3; v++) {
          vertex = geometry.vertices[face[vertexIndices[v]]];
          normalizedAxis = normalized.subVectors(vertex, bbox.min).divide(size)[axis];
          if (reverse) {
            normalizedAxis = 1 - normalizedAxis;
          }
          if (normalizedAxis >= colors[c].stop && normalizedAxis <= colors[c + 1].stop) {
            var localNormalizedAxis = (normalizedAxis - colors[c].stop) / colorDiff;
            face.vertexColors[v] = colors[c].color.clone().lerp(colors[c + 1].color, localNormalizedAxis);
          }
        }
      }
    }
  }
  
  
function startPktSwitchDG() {
  createPacketInfo();
}
function startPktSwitchVC(){
  //choses the best route using the same method as circuit switch
  SndRecArray.forEach(pair => {
    chosenRoute = findBestRoute(pair); //output chosen route
    consoleAdd("ChosenRoute: " + chosenRoute)
    var connArray = [];

    //Takes the found best route, and finds the connections corresponding to them
    for (let index = 0; index < chosenRoute.length - 1; index++) {
      const element = chosenRoute[index];
      var nodeObj = nodeMap.get(element);
      var next = nodeMap.get(chosenRoute[index + 1]);
      for (let value of connectionMap.values()) {
        if ((nodeObj == value.fromNode) && (next == value.toNode)) {
          connArray.push(value);
          invConnMap.set(value, false);
        } else if ((nodeObj == value.toNode) && (next == value.fromNode)) {
          connArray.push(value);
          invConnMap.set(value, true);
        }
      }

    }
  createPacketInfo(pair);
});
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
  const GRAY = "#757575"

  const handleChange = (event) => {
    setMethod(event.target.value);
    Switching_Method = event.target.value;
    //@TODO disable the correct fields

    //if circuit enable - circuit setup disable - header, packet, routing delay
    if (Switching_Method == "Circuit") {
      document.getElementById("text_Circuit_Setup").disabled = false;
      document.getElementById("text_Circuit_Setup").style.color = "#ffffff";


      document.getElementById("text_Header_Size").disabled = true;
      document.getElementById("text_Header_Size").style.color = GRAY;

      document.getElementById("text_Packet_Size").disabled = true;
      document.getElementById("text_Packet_Size").style.color = GRAY;

      document.getElementById("text_Routing_Delay").disabled = true;
      document.getElementById("text_Routing_Delay").style.color = GRAY;
    }
    else {    //if packet either  enable - header, packet, routing delay disable - circuit setup
      document.getElementById("text_Circuit_Setup").disabled = true;
      document.getElementById("text_Circuit_Setup").style.color = GRAY;


      document.getElementById("text_Header_Size").disabled = false;
      document.getElementById("text_Header_Size").style.color = "#ffffff";

      document.getElementById("text_Packet_Size").disabled = false;
      document.getElementById("text_Packet_Size").style.color = "#ffffff";

      document.getElementById("text_Routing_Delay").disabled = false;
      document.getElementById("text_Routing_Delay").style.color = "#ffffff";
    }
  }

  function validateInput() {
    inputIssues = ""
    var result = true;
    if (Switching_Method) {
      //Inputs that are used for both
      if ((isNaN(PropDelay))) {
        result = false;
        inputIssues += "Propagation Delay is Invalid, "
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
        if ((isNaN(HeaderSize))&&(HeaderSize < PktSize)) {
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
      return false;
    }
  }
  var inputIssues;
  const animateSimulation = (event) => {
    //take all values from below and 
    PropDelay = document.getElementById("text_Prop_Delay").value;
    MsgLength = document.getElementById("text_Msg_Length").value;
    TransRate = document.getElementById("text_Transmission_Rate").value;

    if (validateInput) {
      switch (Switching_Method) {
        case "Circuit":
          CircSetupTime = document.getElementById("text_Circuit_Setup").value;
          startCircuitSw();
          break;
        case "Datagram":
          HeaderSize = document.getElementById("text_Header_Size").value;
          PktSize = document.getElementById("text_Packet_Size").value;
          PktRoutingDelay = document.getElementById("text_Routing_Delay").value;
          startPktSwitchDG();
          break;
        case "VirtualCircuit":
          HeaderSize = document.getElementById("text_Header_Size").value;
          PktSize = document.getElementById("text_Packet_Size").value;
          PktRoutingDelay = document.getElementById("text_Routing_Delay").value;
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
      <TextField fullWidth id="text_Prop_Delay" label="Propagation Delay (secs)" variant="outlined" margin="dense" color='#ffffff' className={classes.initVal} defaultValue="10" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Msg_Length" label="Message Length (bits)" variant="outlined" margin="dense" className={classes.initVal} defaultValue="100" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Transmission_Rate" label="Transmission Rate (bits/sec)" variant="outlined" margin="dense" className={classes.initVal} defaultValue="20" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Circuit_Setup" label="Circuit Setup Time (secs)" variant="outlined" margin="dense" className={classes.initVal} disabled defaultValue="4" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Header_Size" label="Header Size (bits)" variant="outlined" margin="dense" className={classes.initVal} disabled defaultValue="10" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Packet_Size" label="Packet Size (bits)" variant="outlined" margin="dense" className={classes.initVal} disabled defaultValue="20" inputProps={{ className: classes.initVal }} />
      <TextField fullWidth id="text_Routing_Delay" label="Packet Routing Delay (secs)" variant="outlined" margin="dense" className={classes.initVal} disabled defaultValue="" inputProps={{ className: classes.initVal }} />
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