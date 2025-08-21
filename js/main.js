// Scene Setup
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
scene.add(dirLight);

// Sand plane
const textureLoader = new THREE.TextureLoader();
const sand = new THREE.Mesh(
  new THREE.PlaneGeometry(50,50),
  new THREE.MeshPhongMaterial({ map: textureLoader.load('assets/textures/sand.jpg') })
);
sand.rotation.x = -Math.PI/2;
sand.receiveShadow = true;
scene.add(sand);

// GLTF Loader
const loader = new THREE.GLTFLoader();

// Load products
function loadModel(path, x, y, z, scale=1) {
  loader.load(path, gltf => {
    gltf.scene.position.set(x,y,z);
    gltf.scene.scale.set(scale,scale,scale);
    scene.add(gltf.scene);
  });
}
loadModel('models/bracelet.glb', -1,1,0);
loadModel('models/necklace.glb', 1,1,0);
loadModel('models/headband.glb', 0,0.8,1);
loadModel('models/outfit.glb', 0,0,-1.5, 1.2);

// Palm trees
const palms = [
  { path:'models/palm1.glb', x:-5, y:0, z:-5, scale:1 },
  { path:'models/palm2.glb', x:4, y:0, z:-3, scale:1.2 },
  { path:'models/palm1.glb', x:0, y:0, z:-7, scale:0.8 }
];
palms.forEach(p => loadModel(p.path, p.x, p.y, p.z, p.scale));

// Scroll camera movement
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY / window.innerHeight;
  camera.position.z = 5 - scrollY*2;
  camera.position.y = 1.5 - scrollY*0.5;
});

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate loop
function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
