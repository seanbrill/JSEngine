import { SceneManager } from "../Classes/Scene/SceneManager";
import { Screen } from "../Classes/UI/Screen";
import { Primitives } from "../Classes/Base/PrimitiveHelpers";
import { MathHelpers } from "../Classes/Base/MathHelpers";
import { ObjectLoader } from "../Classes/Base/ObjectLoader";

// eslint-disable-next-line
const screenXML = require('./demoUI/Screen1/index.html') as string;
const screenCSS = require('./demoUI/Screen1/index.css') as string;

async function Init() {
  let sceneManager = new SceneManager();
  let sceneRoot = document.querySelector(`#root`) as HTMLElement;
  sceneManager.CreateScene(sceneRoot, 'demo-scene', false, true, true);

  // Initialize In-Game UI
  let screens = [];
  let screen1 = new Screen("controls01", screenXML, screenCSS);
  screens.push(screen1);
  sceneManager.UIManager.RegisterScreens(screens);

  let scene = sceneManager.activeScene;
  if (!scene) return;
  let p = new Primitives(scene.scene);

  //create a first person camera
  if (!scene.cameraManager) throw new Error('Scenes Camera Manager was not defined');
  scene.cameraManager.CreateFirstPersonCamera("player", 75, 0.1, 1000, { x: 0, y: 2.5, z: 5 }, { x: 0, y: 0, z: 0 }, 5);
  scene.Start().then(() => {

    //scene.SetSkyBox(["./skybox.png"]);

    //create floor
    p.CreatePlane({ x: 1000, y: 1000 }, { x: 0, y: 0.5, z: 0 }, { x: MathHelpers.DegreesToRadians(270), y: 0, z: 0 }, null, "./moon.png");

    //create cubes
    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, "#29e2a3");
    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 0, y: 2, z: 0 }, { x: 0, y: 0, z: 0 }, "#e20000");
    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 0, y: 3, z: 0 }, { x: 0, y: 0, z: 0 }, "#0642f3");
    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 0, y: 4, z: 0 }, { x: 0, y: 0, z: 0 }, "#dc15cc");

    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: -2, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, "#29e2a3");
    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: -2, y: 2, z: 0 }, { x: 0, y: 0, z: 0 }, "#e20000");
    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: -2, y: 3, z: 0 }, { x: 0, y: 0, z: 0 }, "#0642f3");
    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: -2, y: 4, z: 0 }, { x: 0, y: 0, z: 0 }, "#dc15cc");

    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 2, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, "#29e2a3");
    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 0 }, { x: 0, y: 0, z: 0 }, "#e20000");
    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 2, y: 3, z: 0 }, { x: 0, y: 0, z: 0 }, "#0642f3");
    // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 2, y: 4, z: 0 }, { x: 0, y: 0, z: 0 }, "#dc15cc");

    //load rover
    let rover_scale = 0.05;
    if (!scene) return;
    new ObjectLoader(scene.scene).LoadGLTFModel("./rover.glb", { x: rover_scale, y: rover_scale, z: rover_scale }, { x: 0, y: 0.4, z: -5 }, { x: 0, y: MathHelpers.DegreesToRadians(145), z: 0 });
  });
}
