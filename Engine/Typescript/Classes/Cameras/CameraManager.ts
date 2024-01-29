import { FirstPersonCamera, defaultFristPersonCameraOptions } from "./FirstPersonCamera";
import { Camera } from "./Camera";
import * as THREE from "three";
import { PhysicsOptions, defaultPhysicsOptions } from "../Base/Physics/Physics";
import { position, rotation } from "../Base/Interfaces";
import { Scene } from "../Scene/Scene";

export class CameraManager {
  scene: Scene;
  cameras: Camera[] = [];
  activeIndex: number = 0;
  MainCamera: Camera | null = null;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  Update() {
    this.cameras.forEach((camera) => camera.Update());
  }

  //Camera Types
  CreateCamera(name?: string, fov?: number, near?: number, far?: number, pos?: position, rot?: rotation) {
    // Use default values if parameters are not provided
    name = name || "DefaultCamera";
    fov = fov === undefined ? 75 : fov;
    near = near === undefined ? 0.1 : near;
    far = far === undefined ? 1000 : far;
    let cam = new Camera(this.scene, name, fov, near, far, pos, rot);
    this.cameras.push(cam);
    if (this.scene)
      this.scene.appScene.add(cam.camera);
    if (!this.MainCamera) this.MainCamera = cam;
  }

  CreateFirstPersonCamera(name: string, fov: number, near: number, far: number, pos: position, rot: rotation, movementSpeed: number, options = defaultFristPersonCameraOptions, physicsOptions: PhysicsOptions = defaultPhysicsOptions) {
    let cam = new FirstPersonCamera(this.scene, name, fov, near, far, pos, rot, movementSpeed, options, physicsOptions);
    this.cameras.push(cam);
    this.scene.appScene.add(cam.camera);
    if (!this.MainCamera) this.MainCamera = cam;
  }

  CreateThirdPersonCamera() { }

  CreateFreeFlyCamera() { }

  CreateOrbitCamera() { }

  NextCamera() {
    if (this.activeIndex + 1 < this.cameras.length) this.activeIndex++;
    this.MainCamera = this.cameras[this.activeIndex];
  }

  PreviousCamera() {
    if (this.activeIndex - 1 >= 0) this.activeIndex--;
    this.MainCamera = this.cameras[this.activeIndex];
  }

  SetActiveCameraIndex(index: number) {
    if (index >= 0 && index < this.cameras.length) {
      let cam = this.cameras[index];
      if (cam) {
        this.activeIndex = index;
        this.MainCamera = cam;
      } else {
        console.log("camera was null");
      }
    } else {
      throw new Error("Camera Index Out Of Bounds!");
    }
  }

  SetActiveCameraByName(name: string) {
    let cam = this.cameras.find((x) => x.name == name);
    if (cam) {
      this.activeIndex = this.cameras.indexOf(cam);
      this.MainCamera = cam;
    } else {
      throw new Error("No Camera With Matching Name!");
    }
  }
}
