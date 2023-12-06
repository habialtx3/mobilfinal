import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import gsap from "gsap";
import * as TWEEN from "tween.js";
import * as dat from "dat.gui";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

camera.position.set(0, 2, 12);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
const sound = new THREE.PositionalAudio(listener);

function startMusic() {
  audioLoader.load("../assets/tokyo.mp3", function (buffer) {
    isSoundActive = true;
    sound.setBuffer(buffer);
    sound.setRefDistance(20);
    sound.setLoop(true);
    sound.play();
  });
}

function stopMusic() {
  isSoundActive = false;
  sound.stop();
}

// Create OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// sumbu z
controls.minDistance = 10;
controls.maxDistance = 15;
// sumbu y
controls.minPolarAngle = Math.PI / 3;
controls.maxPolarAngle = -3;

let isGSAPActive = false;
let isSoundActive = false;

const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById("progress-bar");
loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};

const progressBarContainer = document.querySelector(".progress-bar-container");
loadingManager.onLoad = function () {
  progressBarContainer.style.display = "none";
  startMusic();
  startGSAPAnimation();
};

const loader = new GLTFLoader(loadingManager);
//mobil

let activeModel;
function loadMobil(namaMobil) {
  const mobilPath = `../assets/${namaMobil}`;
  loader.load(mobilPath, (gltf) => {
    const model = gltf.scene;
    model.scale.set(2, 2, 2);
    model.position.y = 1.85;
    model.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    if (activeModel) {
      scene.remove(activeModel);
    }
    activeModel = model;
    scene.add(model);
  });
}

loadMobil("audi_r8_3d_model.glb");
// loadMobil(modelOptions.Mobil1);

//basement
loader.load("../assets/belajar1.glb", (gltf) => {
  const model = gltf.scene;
  model.scale.set(1, 1, 1);

  model.traverse(function (node) {
    if (node.isMesh) {
      node.receiveShadow = true;
    }
  });

  scene.add(model);
});

//cahaya
const color = 0xffffff;
const intensity = 0;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

// Create PointLight
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 15, 0);
pointLight.intensity = 80;
pointLight.castShadow = true;

// Set up shadow properties
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 13.5;
pointLight.shadow.camera.far = 500;
scene.add(pointLight);

// Create RectAreaLight
const rectAreaLight = new THREE.RectAreaLight(0xff0000, 3, 10, 5);
rectAreaLight.position.set(50, 7, 50);
rectAreaLight.lookAt(-50, 15, 15);
scene.add(rectAreaLight);

// Create RectAreaLight
const rectAreaLight2 = new THREE.RectAreaLight(0x0000ff, 3, 20, -40);
rectAreaLight2.position.set(-10, 10, 50);
rectAreaLight2.lookAt(-50, 15, 15);
scene.add(rectAreaLight2);

function startGSAPAnimation() {
  controls.enabled = false;
  isGSAPActive = true;
  const tl = gsap.timeline();
  camera.position.set(0, 2, 12);
  controls.target.set(0, 0, 0);
  tl.to(camera.position, {
    y: 8,
    z: -4,
    duration: 5,
    onUpdate: function () {
      camera.lookAt(0, 0, 0);
    },
  })
    .to({}, { duration: 0.000001, onComplete: moveCamera })
    .to(camera.position, {
      z: 2,
      y: 3,
      x: -4,
      duration: 5,
      onUpdate: function () {
        camera.lookAt(0, 0, 0);
      },
    })
    .to({}, { duration: 0.000001, onComplete: moveCamera })
    .to(camera.position, {
      x: 5,
      z: 0,
      duration: 5,
      onUpdate: function () {
        camera.lookAt(0, 0, 0);
      },
    })
    .to({}, { duration: 0.000001, onComplete: moveCamera })
    .to(camera.position, {
      x: 1,
      z: 2,
      duration: 5,
      onUpdate: function () {
        camera.lookAt(-2, 0, 1);
      },
    })
    .to({}, { duration: 0.000001, onComplete: moveCamera })
    .to(camera.position, {
      y: 8,
      z: -2,
      duration: 5,
      onUpdate: function () {
        camera.lookAt(0, 0, 0);
      },
    })
    .repeat(-1);
}

function moveCamera() {
  camera.position.set(0, 4, 10);
  console.log("Camera moved to (0, 0, 0)");
  tlNext();
}

function stopGSAPAndActivateOrbitControls() {
  isGSAPActive = false;
  gsap.globalTimeline.clear();
  controls.enabled = true;
  camera.position.set(0, 2, -12);
  controls.target.set(0, 0, 0);
  controls.update();
}

const modelOptions = {
  gui: {
    Mobil1: "audi_r8_3d_model.glb",
    Mobil2: "lotus_elise.glb",
  },
};

const gui = new dat.GUI({ autoPlace: false });
const guiControls = {
  cameraToggleAnimation: function () {
    if (isGSAPActive) {
      stopGSAPAndActivateOrbitControls();
    } else {
      startGSAPAnimation();
    }
  },
  soundToggleAnimation: function () {
    if (isSoundActive) {
      stopMusic();
    } else {
      startMusic();
    }
  },
  PilihModel: "Mobil1",
};

Object.assign(guiControls, modelOptions.gui);

// Menambahkan kontrol ke masing-masing menu
gui.add(guiControls, "cameraToggleAnimation").name("🎥");
gui.add(guiControls, "soundToggleAnimation").name("🎵");
const modelController = gui
  .add(guiControls, "PilihModel", Object.keys(modelOptions.gui))
  .name("🚗");

const comboController = modelController.domElement.parentElement.parentElement;
comboController.style.background = "#f0f0f0"; // Warna latar belakang combo box
comboController.style.border = "1px solid #ccc"; // Border combo box
comboController.style.borderRadius = "4px"; // Border radius combo box

function changeModel() {
  const selectedModel = modelOptions.gui[modelController.getValue()];
  loadMobil(selectedModel);
}

// Menambahkan event listener untuk memanggil fungsi changeModel saat pilihan berubah
modelController.onChange(changeModel);

// Menentukan properti-posisi untuk menu pertama
gui.domElement.style.position = "absolute";
gui.domElement.style.top = "50px";
gui.domElement.style.left = "5%";
gui.domElement.style.transform = "translateX(-50%)";
gui.domElement.style.textAlign = "center";
gui.domElement.style.fontSize = "20px";
gui.width = 100;

document.body.appendChild(gui.domElement);

const closeButtons = document.querySelectorAll(".close-button");
closeButtons.forEach((button) => {
  button.style.display = "none";
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  TWEEN.update();

  new TWEEN.Tween(rectAreaLight)
    .to({ intensity: Math.random() * 10 }, 50)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  new TWEEN.Tween(rectAreaLight2)
    .to({ intensity: Math.random() * 10 }, 50)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();

  controls.update();
  renderer.render(scene, camera);
}

animate();
