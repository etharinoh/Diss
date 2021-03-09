import Navigation from "../../components/navigation";

import * as THREE from "three";
import { Component } from "react";

import { TextField, Button } from "@material-ui/core"
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

var width = window.innerWidth*0.725;
var height = window.innerHeight*0.725;


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 10, width/height, 0.1, 2000 );
var renderer = new THREE.WebGLRenderer();


class Tool extends Component{
    componentDidMount() {
        // === THREE.JS CODE START ===
        
        
        renderer.setSize( width, height );
        document.body.appendChild( renderer.domElement );
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );

        
        var container = document.getElementById( 'canvas' );

        container.appendChild( renderer.domElement );

        //scene.add(cube);
        camera.position.z = 10;
        var animate = function () {
          requestAnimationFrame( animate );
          renderer.render( scene, camera );
        };
        animate();
        // === THREE.JS EXAMPLE CODE END ===
      }
      render() {
        return (
          <div>

          </div>
        )
      }
}


class InteractiveBuilder extends Component{
  render(){
    return(
      <div>
      <Navigation />
      <div id="Interactive_Container">
        
        <div id="left">
          <Button id="state_button"> Add Node</Button>
          <Button id="state_button"> Add Connection</Button>
          <Button id="state_button"> Remove Node</Button>
          <Button id="state_button"> Remove Connection</Button>
        </div>
        <div id="canvas">
          <Tool />
        </div>
        <div id="right">
            <div id="init_val">
              <p>Initial Values</p>
              {/* Setup form in here*/}
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
                sc
              />
            </div>
        </div>
      </div>
      </div>
    )
  }
}
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('mousedown', addCircle,false);

function addCircle(event){
  {
    const circle = new THREE.Shape();
     
    mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.clientHeight ) * 2 + 1;

    //alert(event.clientX + "y " + event.clientY);

    const radius = 0.1;
    circle.absarc(mouse.x, mouse.y, radius);

    const segments = 100;
    const geometry = new THREE.ShapeGeometry(circle, segments / 2);

    const material = new THREE.MeshBasicMaterial({
      color: "#F2AFAF",
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    var animate = function () {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    };
    animate();

    consoleAdd("Circle added at: " + mouse.x +", " + mouse.y);
  }
}

function addConnection(event){
  //draw a line by selecting two circle, raycaster, highlight
}

//If the click isnt on a 
function removeNode(event){
  //If a node is clicked, remove the node and any connections that it has
}
function removeConnection(event){
  //If a connection is clicked delete it
}

function consoleClear(){
  //Get document text and clear
  document.getElementById("consoleText").value = "";
}
function consoleAdd(toAdd){
  document.getElementById("consoleText").value += "\n>>"+toAdd;
}


function addConnectClick(){
  if (buttonChecked == button_options.ADDCONNECT) {
    //Clear colours
    buttonChecked = button_options.NONE;
  }
  else{
    //Clear button method, change to selected
    buttonChecked = button_options.ADDCONNECT;
  }
}

function clearButton(){

}
export default InteractiveBuilder;