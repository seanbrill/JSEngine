import * as THREE from "three";
import { Scene } from "./Scene";
import { InputManager } from "../Input/InputManager";
import { CameraManager } from "../Cameras/CameraManager";
import { Primitives } from "../Base/PrimitiveHelpers";
import { UIManager } from "../UI/UIManager";

export class SceneManager {
  scenes: Scene[] = [];
  activeScene: Scene | undefined;
  activeSceneIndex: number = 0;
  UIManager: UIManager;

  constructor() {
    window.SceneManager = this;
    this.UIManager = new UIManager();
  }

  /**
   * Creates a new scene object and adds to the static array of scenes
   * @param {HTMLElement} parentNode  - the parent html element to create a scene on
   * @param {string} sceneName  - the name of the scene to create
   * @param {boolean} defaultCamera  - a boolean to create a standard camera or not
   * @param {boolean} defaultLight  - a boolean to create a standard light or not
   * @param {boolean} trackFPS  - a boolean to track fps or not, will slightly affect performance
   * @returns {void}  desc
   */
  CreateScene(parentNode: HTMLElement, sceneName: string, defaultCamera: boolean = true, defaultLight: boolean = true, trackFPS: boolean = true): void {
    window.SceneManager = this;
    //prevent duplicate scene from instantiating
    if (this.scenes.find((x) => x.sceneName == sceneName)) return;
    if (!parentNode) return;

    //create scene object
    let new_scene = new Scene(sceneName, trackFPS);
    new_scene.sceneName = sceneName;
    new_scene.inputManager = new InputManager();
    new_scene.cameraManager = new CameraManager(new_scene.scene);

    //create a canvas element
    new_scene.parent = parentNode;
    new_scene.canvas = document.createElement("canvas");
    new_scene.canvas.id = sceneName;
    new_scene.parent.appendChild(new_scene.canvas);
    new_scene.canvas.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    //create a camera for the scene if a default one is specified
    if (defaultCamera) {
      new_scene.cameraManager.CreateCamera();
    }

    //create a default light source
    if (defaultLight) {
      let prim = new Primitives(new_scene.scene);
      prim.CreateDirectionalLight(0xffffff, { x: 0, y: 10, z: 0 }, { x: 0, y: 0, z: 0 }, 3);
    }

    new_scene.renderer = new THREE.WebGLRenderer({ canvas: new_scene.canvas, antialias: true, powerPreference: "high-performance" });
    new_scene.renderer.setSize(parentNode.clientWidth, parentNode.clientHeight);

    //setup fps ui
    if (trackFPS) {
      let existing_counter = document.querySelector("#" + new_scene.sceneName + "-fps-counter") as HTMLElement;
      if (existing_counter) {
        new_scene.fpsCounter = existing_counter;
        return;
      }
      new_scene.fpsCounter = document.createElement("span");
      new_scene.fpsCounter.id = new_scene.sceneName + "-fps-counter";
      document.body.appendChild(new_scene.fpsCounter);
      new_scene.fpsCounter.innerText = `fps: ${new_scene.fps}, avg: ${new_scene.avgFPS}`;
      new_scene.fpsCounter.style.position = "absolute";
      new_scene.fpsCounter.style.top = "5px";
      new_scene.fpsCounter.style.left = "5px";
      new_scene.fpsCounter.style.color = "#3ab3ff";
    }

    this.scenes.push(new_scene);
    console.log('setting scene manager active scene');
    if (this.activeScene == null) this.activeScene = new_scene;
  }

  NextScene() {
    if (this.activeSceneIndex + 1 <= this.scenes.length) {
      this.activeSceneIndex += 1;
      if (this.activeScene) this.activeScene.Stop();
      this.activeScene = this.scenes[this.activeSceneIndex];
      this.activeScene.Start();
    }
  }

  PreviousScene() {
    if (this.activeSceneIndex - 1 >= 0) {
      this.activeSceneIndex -= 1;
      if (this.activeScene) this.activeScene.Stop();
      this.activeScene = this.scenes[this.activeSceneIndex];
      this.activeScene.Start();
    }
  }

  LoadScene(sceneName: string) {
    let targetScene = this.scenes.find((x) => x.sceneName == sceneName);
    if (targetScene) {
      this.activeSceneIndex = this.scenes.indexOf(targetScene);
      if (this.activeScene) this.activeScene.Stop();
      this.activeScene = targetScene;
      this.activeScene.Start();
    }
  }
}
