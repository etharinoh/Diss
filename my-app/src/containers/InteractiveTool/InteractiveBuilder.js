import Navigation from "../../components/navigation";

import * as THREE from "three";
import { Component } from "react";
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        var renderer = new THREE.WebGLRenderer();
class InteractiveBuilder extends Component{
    componentDidMount() {
        // === THREE.JS CODE START ===
        
        
        renderer.setSize( 1600, 800 );
        document.body.appendChild( renderer.domElement );
        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );

        

        scene.add(cube);
        camera.position.z = 10;
        camera.position.x = 10;
        camera.position.y = 5;
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
          <Navigation />
          <div id="left"></div>
          <div id="canvas"></div>
          <div id="right"></div>
          </div>
        )
      }
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', addCircle,false);

function addCircle(event){
  {
    const circle = new THREE.Shape();
     
    mouse.x = ( event.clientX / 1600 ) * 2;
	mouse.y = ( event.clientY / 800 ) * 2;

    //alert("x:"+mouse.x+"  y:"+mouse.y);

    const radius = .5;
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
  }
}
export default InteractiveBuilder;