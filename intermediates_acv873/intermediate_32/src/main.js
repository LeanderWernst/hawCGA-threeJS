// External libraries
import * as THREE from '../../../lib/three.js-r134/build/three.module.js';
import * as CONTROLS from '../../../lib/three.js-r134/examples/jsm/controls/OrbitControls.js';
import * as DAT from '../../../lib/dat.gui-0.7.7/build/dat.gui.module.js';
import * as TWEEN from '../../../lib/tween.js-18.6.4/dist/tween.esm.js';

// Own modules
import Television from './objects/Television.js';
import TelevisionFromFile from './objects/TelevisionFromFile.js';
import TableFromFile from './objects/TableFromFile.js';
import Floor from './objects/Floor.js';
import Physics from './physics/Physics.js';

// Event functions
import {updateAspectRatio} from './eventfunctions/updateAspectRatio.js';
import {calculateMousePosition} from './eventfunctions/calculateMousePosition.js';
import {executeRaycast} from './eventfunctions/executeRaycast.js';

function main() {

  window.scene = new THREE.Scene();
  window.scene.add(new THREE.AxesHelper(50));

  window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  window.camera.position.set(-100, 200, 200);

  window.renderer = new THREE.WebGLRenderer({antialias: true});
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(0xffffff);
  window.renderer.shadowMap.enabled = true;

  window.physics = new Physics(true);
  window.physics.setup(0,-200,0, 1/120, true);

  document.getElementById('3d_content').appendChild(window.renderer.domElement);

  const television = new Television();
  television.position.set(-30, 16.8 + 39, 0);
  television.rotation.set(0, THREE.MathUtils.degToRad(10), 0);
  window.scene.add(television);

  const televisionFromFile = new TelevisionFromFile();
  televisionFromFile.position.set(30, 16.8 + 39, 0);
  televisionFromFile.rotation.set(0, THREE.MathUtils.degToRad(-10), 0);
  window.scene.add(televisionFromFile);

  const tableFromFile = new TableFromFile();
  tableFromFile.position.set(0, 0, 0);
  window.scene.add(tableFromFile);

/*  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshLambertMaterial({color: 0xAAAAAA, wireframe: false});
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
  plane.receiveShadow = true;
  window.scene.add(plane);*/

  const floor = new Floor();
  window.scene.add(floor);



  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.5;
  window.scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 200, 200);
  spotLight.intensity = 0.8;
  spotLight.target = floor;
  spotLight.angle = THREE.MathUtils.degToRad(30);
  spotLight.penumbra = 1;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(2048, 2048);
  spotLight.shadow.camera.aspect = 1;
  spotLight.shadow.camera.near = 100;
  spotLight.shadow.camera.far = 500;
  spotLight.shadow.bias = -0.001;
  //window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
  window.scene.add(spotLight);

  const spotLight2 = new THREE.SpotLight(0xffffff);
  spotLight2.position.set(-0, 150, -200);
  spotLight2.intensity = 0.8;
  spotLight2.target = floor;
  spotLight2.angle = THREE.MathUtils.degToRad(30);
  spotLight2.penumbra = 1;
  spotLight2.castShadow = false;
  spotLight2.shadow.mapSize.set(2048, 2048);
  spotLight2.shadow.camera.aspect = 1;
  spotLight2.shadow.camera.near = 10;
  spotLight2.shadow.camera.far = 500;
  //window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
  window.scene.add(spotLight2);

  const orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
  orbitControls.target = new THREE.Vector3(0, 0, 0);
  orbitControls.update();

  const gui = new DAT.GUI();
  gui.add(spotLight.position, 'x', 0, 200).step(5);
  gui.add(spotLight.position, 'y', 0, 200).step(5);
  gui.add(spotLight.position, 'z', 0, 200).step(5);

  const clock = new THREE.Clock();

  function mainLoop() {

    const delta = clock.getDelta();

    window.physics.update(delta);

    television.animations.forEach(function (animation) {
      animation.update(delta);
    });

    TWEEN.update();

    if(televisionFromFile.animationMixer !== null) {
      televisionFromFile.animationMixer.update(delta);
    }

    window.renderer.render(window.scene, window.camera);
    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

window.onload = main;
window.onresize = updateAspectRatio;
window.onmousemove = calculateMousePosition;
window.onclick = executeRaycast;