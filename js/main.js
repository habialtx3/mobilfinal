import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff);
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(-10, 0, 0);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const gui = new dat.GUI();
const option = {
  cubeColor: "#ffea00",
  sphereColor: "#ffff00",
};
gui.addColor(option, "cubeColor").onChange(function (e) {
  cube.material.color.set(e);
});
gui.addColor(option, "sphereColor").onChange(function (e) {
  sphere.material.color.set(e);
});
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.z = 10;
orbit.update();

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
