import * as THREE from "three";
import { InputManager } from "../Input/InputManager";
import { CameraManager } from "../Cameras/CameraManager";
import { GameObject } from "../Base/GameObject";
import { UIManager } from "../UI/UIManager";

export class Scene {
  parent: HTMLElement | undefined;
  canvas: HTMLCanvasElement | undefined;
  sceneName: string;
  scene: THREE.Scene;
  renderer: THREE.Renderer | undefined;
  inputManager: InputManager | undefined;
  cameraManager: CameraManager | undefined;
  isActive: boolean = false;
  previousFrame: Scene | undefined;
  objects: GameObject[] = [];

  //fps
  trackFPS;
  frame = 0;
  frame_counter = 0;
  programStartTime: number = 0;
  fpsStartTime: number = 0;
  fpsCounter: HTMLElement | null = null;
  fps = 0;
  avgFPS = 0;

  //time
  deltaTime: number = 0;
  currentTime: number = 0;

  constructor(sceneName: string, trackFPS: boolean = false) {
    this.sceneName = sceneName;
    this.trackFPS = trackFPS;
    this.scene = new THREE.Scene();
    //resize scene to browser window
    window.addEventListener("resize", () => {
      if (this.renderer != undefined && this.parent != undefined && this.cameraManager?.MainCamera?.camera instanceof THREE.PerspectiveCamera) {
        const newWidth = this.parent.clientWidth;
        const newHeight = this.parent.clientHeight;

        // Update renderer size
        this.renderer.setSize(newWidth, newHeight);

        // Update camera aspect ratio
        if (this.cameraManager && this.cameraManager.MainCamera) {
          this.cameraManager.MainCamera.camera.aspect = newWidth / newHeight;
          this.cameraManager.MainCamera.camera.updateProjectionMatrix();
        }
      }
    });
  }

  /**
   * Starts a scenes game loop
   * @returns {Promise<void>}  a promise that resolves after the first frame of the scene has run
   */
  Start(animateLogic = () => { }): Promise<void> {
    //prevent double starting a scene
    if (this.isActive) {
      return new Promise((resolve) => {
        return resolve();
      });
    }
    //reset fps stats if re-starting the scene
    this.frame = 0;
    this.frame_counter = 0;
    this.programStartTime = 0;
    this.isActive = true;
    return new Promise((resolve) => {
      const animate = () => {
        //Validate
        if (!this.cameraManager) throw new Error("Three js camera must be initialized to start the scene");
        if (!this.cameraManager.MainCamera) throw new Error("Three js camera must be initialized to start the scene");
        if (!this.cameraManager.MainCamera.camera) throw new Error("Three js camera must be initialized to start the scene");
        if (!this.scene) throw new Error("Three js scene must be initialized to start the scene");
        if (!this.renderer) throw new Error("Renderer must be initialized to start the scene");
        if (!this.isActive) return;
        let timeStart = performance.now();
        requestAnimationFrame(animate);
        if (this.trackFPS) {
          if (this.frame === 0) {
            this.programStartTime = performance.now();
            this.fpsStartTime = this.programStartTime;
          }
          this.frame += 1;
          this.frame_counter += 1;
          this.CalculateFPS();
        }
        animateLogic();
        this.renderer.render(this.scene, this.cameraManager.MainCamera.camera);
        this.cameraManager.Update();
        UIManager.Update();
        this.deltaTime = (performance.now() - timeStart) / 1000;
      };
      //call animate the first time
      animate();
      resolve();
    });
  }

  Stop() {
    this.isActive = false;
  }

  Update() {
    this.previousFrame = { ...this };
  }

  SetSkyBox(skybox_texture_paths = []) {
    try {
      //if (skybox_texture_paths.length != 6) skybox_texture_paths = [skybox_texture_paths[0], skybox_texture_paths[0], skybox_texture_paths[0], skybox_texture_paths[0], skybox_texture_paths[0], skybox_texture_paths[0]];
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(skybox_texture_paths[0]);
      const geometry = new THREE.BoxGeometry(1000, 1000, 1000); // Adjust the size as needed
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
      const skybox = new THREE.Mesh(geometry, material);
      skybox.position.copy(new THREE.Vector3(0, 0, 0));
      this.scene.add(skybox);
    } catch (error) {
      console.log("set skybox error: ", error);
    }
  }

  /**
   * Shows the on screen fps counter
   * @returns {void}  desc
   */
  ShowFPS(): void {
    if (this.fpsCounter) {
      this.fpsCounter.style.display = "flex";
    }
  }

  /**
   * Updates the fps counter text and calculates the current and avaerage fps
   * @returns {void}  desc
   */
  CalculateFPS(): void {
    this.currentTime = performance.now();
    let totalElapsedTime = this.currentTime - this.programStartTime;
    let sinceLastRefresh = this.currentTime - this.fpsStartTime;
    if (!this.fpsStartTime) this.fpsStartTime = this.currentTime;

    //update avg fps every 1 seconds
    if (sinceLastRefresh >= 1000) {
      this.avgFPS = Math.floor(this.frame / (totalElapsedTime / 1000));
      this.fps = Math.floor(this.frame_counter / (sinceLastRefresh / 1000));
      this.frame_counter = 0;
      //reset relative start time
      this.fpsStartTime = this.currentTime;
    }

    //update fps counter text
    if (this.fpsCounter) {
      this.fpsCounter.innerText = `fps: ${this.fps}, \navg: ${this.avgFPS}`;
    }
  }

  /**
   * Hides the on screen fps counter
   * @returns {voide}  desc
   */
  HideFPS(): void {
    if (this.fpsCounter) {
      this.fpsCounter.style.display = "none";
    }
  }
}
