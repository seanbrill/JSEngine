import * as THREE from "three";
import { GameObject } from "../Base/GameObject";
import { PhysicsOptions, defaultPhysicsOptions } from "../Base/Physics/Physics";
import { position, rotation } from "../Base/Interfaces";
import { Scene } from "../Scene/Scene";

export class Camera extends GameObject {
  camera: THREE.Camera;
  fov: number;
  near: number;
  far: number;

  constructor(scene: Scene, name: string, fov: number, near: number, far: number, position: position = { x: 0, y: 0, z: 0 }, rotation: rotation = { x: 0, y: 0, z: 0 }, physicsOptions: PhysicsOptions = defaultPhysicsOptions) {
    super(scene, name, undefined, physicsOptions);
    this.name = name;
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
    this._object = this.camera;
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.rotation.set(rotation.x, rotation.y, rotation.z);
  }

  Update() {
    super.Update();
  }

  ShowWireFrame() { }

  RayCast() { }

  TeleportTo(destination: position) { }

  TransitionTo(destination: position, time: number) { }
}
