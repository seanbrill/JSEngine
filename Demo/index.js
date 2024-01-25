//import all static assets first
import "./assets/favicon.ico";
import "./index.css";
import "./ui/screen1.css";
import { SceneManager } from "../Engine/Javascript/Classes/Scene/SceneManager";
import { Screen } from "../Engine/Javascript/Classes/UI/Screen";
import { Primitives } from "../Engine/Javascript/Classes/Base/PrimitiveHelpers";
import { MathHelpers } from "../Engine/Javascript/Classes/Base/MathHelpers";
import { ObjectLoader } from "../Engine/Javascript/Classes/Base/ObjectLoader";
import { InputManager } from "../Engine/Javascript/Classes/Input/InputManager";
//import these images so they are included in the dist
import skybox from "./assets/skybox.png";
import moon_texture from "./assets/moon.png";
import rover from "./assets/rover.glb";
import capsule from "./assets/lunar_capsule.glb";
import rightMouseIcon from "./assets/right-click.png";

async function Init() {
  let sceneManager = new SceneManager();
  let sceneRoot = document.querySelector("#root");
  sceneManager.CreateScene(sceneRoot, "demo-scene", false, true, true);

  // Initialize In-Game UI
  function screenLoadFunction() {
    let mouseImg = document.querySelector("#right-mouse");
    if (mouseImg) mouseImg.src = rightMouseIcon;
  }
  function screenUpdateFunction() {
    let keys = InputManager.GetActiveKeys();
    let w = document.querySelector("#w");
    let a = document.querySelector("#a");
    let s = document.querySelector("#s");
    let d = document.querySelector("#d");

    let normalBoxShadow = "0px 4px 0px 3px rgb(177, 176, 176)";
    let pressBoxShadow = "0px 4px 0px 4px rgb(156, 154, 154)";

    if (w) {
      if (keys.has("KeyW")) w.style.boxShadow = pressBoxShadow;
      else w.style.boxShadow = normalBoxShadow;
    }

    if (a) {
      if (keys.has("KeyA")) a.style.boxShadow = pressBoxShadow;
      else a.style.boxShadow = normalBoxShadow;
    }

    if (s) {
      if (keys.has("KeyS")) s.style.boxShadow = pressBoxShadow;
      else s.style.boxShadow = normalBoxShadow;
    }

    if (d) {
      if (keys.has("KeyD")) d.style.boxShadow = pressBoxShadow;
      else d.style.boxShadow = normalBoxShadow;
    }
  }
  let screen1 = new Screen("controls01", "screen1.html", screenLoadFunction, screenUpdateFunction);
  sceneManager.UIManager.RegisterScreens([screen1]);

  let scene = sceneManager.activeScene;
  if (!scene) return;
  let p = new Primitives(scene.scene);
  //create a first person camera
  if (!scene.cameraManager) throw new Error("Scenes Camera Manager was not defined");
  scene.cameraManager.CreateFirstPersonCamera("player", 75, 0.1, 1000, { x: 0, y: 2.5, z: 5 }, { x: 0, y: 0, z: 0 }, 5);
  scene.Start().then(() => {
    //create skybox
    scene.SetSkyBox(["./skybox.png"]);
    //create ground material
    p.CreatePlane({ x: 1000, y: 1000 }, { x: 0, y: 0.5, z: 0 }, { x: MathHelpers.DegreesToRadians(270), y: 0, z: 0 }, null, "./moon.png");
    //create lunar rover
    let rover_scale = 0.05;
    new ObjectLoader(scene.scene).LoadGLTFModel("./rover.glb", { x: rover_scale, y: rover_scale, z: rover_scale }, { x: 0, y: 0.4, z: -5 }, { x: 0, y: MathHelpers.DegreesToRadians(145), z: 0 });
    //rceate lunar capsule
    new ObjectLoader(scene.scene).LoadGLTFModel("./lunar_capsule.glb", { x: 20, y: 20, z: 20 }, { x: -15, y: 4.5, z: -10 }, { x: 0, y: MathHelpers.DegreesToRadians(-90), z: 0 });
  });
}

Init();
