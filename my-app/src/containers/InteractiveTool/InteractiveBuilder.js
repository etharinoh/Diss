import Navigation from "../../components/navigation";

import * as THREE from "three";
import { Component } from "react";
import React from 'react';

import { TextField, Button, InputLabel, Select, MenuItem, makeStyles, withTheme, ButtonGroup } from "@material-ui/core"
import "./Interactive.css"



//Creates an enum for the different options for the selected button
const button_options = {
  ADDNODE: "addNode",
  REMOVENODE: "removeNode",
  ADDCONNECT: "addConnection",
  REMOVECONNECT: "removeConnection",
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


    camera = new THREE.PerspectiveCamera(10, 1, 0.1, 50)
    camera.position.z = 12;
    camera.updateProjectionMatrix();
  raycaster.setFromCamera(mouse, camera);

    var animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }


  points = [];


  clickHandler = (event) => {
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

    switch (buttonChecked) {
      case button_options.ADDNODE:
        addNode(event);
        break;
      case button_options.ADDCONNECT:
        var current = addConnection(event);
        if (this.points.length == 0) {
          this.points.push(current);
          consoleAdd("Point added at: " + current);
        }
        else {
          this.points.push(current);
          const geometry = new THREE.BufferGeometry().setFromPoints(this.points);
          const line = new THREE.Line(geometry, material);
          scene.add(line);
          var animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
          };
          animate();
          consoleAdd("Connection added");
        }
        break;
      case button_options.REMOVENODE:
        removeNode(event);
        break;
      case button_options.REMOVECONNECT:
        removeConnection(event);
        break;
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

const useStyles = makeStyles((theme) => ({
  label: {
    margin: theme.spacing(1),
    color: "white"
  },
  state_button: {
    width: "100%",
    color: "white",
    backgroundColor: "#3b3b3b",
    height: "100%"

  }
}));

function ButtonsGroup() {
  return (
    <div>
      <Button className={useStyles().state_button} onClick={addNodeClick} id="AddNode"> Add Node</Button>
      <Button className={useStyles().state_button} onClick={addConnectionClick} id="AddConnection"> Add Connection</Button>
      <Button className={useStyles().state_button} onClick={removeNodeClick} id="RemoveNode"> Remove Node</Button>
      <Button className={useStyles().state_button} onClick={removeConnectionClick} id="RemoveConnection"> Remove Connection</Button>
    </div>
  )
}

function InitialValues() {
  const classes = useStyles();
  const [method, setMethod] = React.useState("");

  const handleChange = (event) => {
    setMethod(event.target.value);
  }
  return (
    <div id="initial_container">
      <InputLabel id="lbl_Sw_Method" className={classes.label}>Switching Method</InputLabel>
      <Select labelId="lbl_Sw_Method" id="select_Sw_Method" value={method} onChange={handleChange}>
        <MenuItem value="Circuit">Circuit Switching</MenuItem>
        <MenuItem value="Packet">Packet Switching</MenuItem>
      </Select>
    </div>
  )
}


function listenResize() {

  //camera.aspect = (container.clientWidth / container.clientHeight);
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);

}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();



function addNode(event) {
  {
    mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - ((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;


    const radius = 0.1;

    const segments = 100;
    const geometry = new THREE.CircleGeometry( radius, segments );
    const material = new THREE.MeshBasicMaterial( { color: 0xF2AFAF } );
    const circle = new THREE.Mesh( geometry, material );
    circle.position.set(mouse.x,mouse.y,1);
    scene.add(circle);

    var animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    consoleAdd("Circle added at: " + circle.position.x + ", " + circle.position.y);
  }
}
var intersects = [];
function addConnection(event) {
  //draw a line by selecting two circle, raycaster, highlight
  intersects = [];
  raycaster.setFromCamera( mouse, camera );
  intersects = raycaster.intersectObjects(scene.children);
  console.log(intersects);
  intersects[0].object.material.color.set(0xff0000);
  return intersects[0].object.position;
}

//If the click isnt on a 
function removeNode(event) {
  //If a node is clicked, remove the node and any connections that it has
}
function removeConnection(event) {
  //If a connection is clicked delete it
}

function consoleClear() {
  //Get document text and clear
  document.getElementById("consoleText").value = "";
}
function consoleAdd(toAdd) {
  document.getElementById("consoleText").value = ">> " + toAdd + "\n" + document.getElementById("consoleText").value;
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


function clearButton() {
  consoleClear();
}
export default InteractiveBuilder;