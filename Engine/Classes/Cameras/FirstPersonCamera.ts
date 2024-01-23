import * as THREE from "three";
import { Camera } from "./Camera";
import { InputManager } from "../Input/InputManager";
import { clamp } from "three/src/math/MathUtils";
import { PhysicsOptions, defaultPhysicsOptions } from "../Base/Physics/Physics";
import { position, rotation } from "../Base/Interfaces";

export interface FirstPersonCameraOptions {
  enableCameraBob: boolean,
  cameraAcceleration: number,
  useMomentum: boolean,
  maxMoveOperations: number,
  usePhysics: boolean,
  enableJump: boolean,
  jumpHeight: number,
  enableCollision: boolean,
  toggleLook: boolean,
  keyDownLook: boolean,
  lookToggleKeys: string[],
  lookHeldKeys: string[],
  forwardKeys: string[],
  leftKeys: string[],
  backKeys: string[],
  rightKeys: string[],
  jumpKeys: string[],
}
export const defaultFristPersonCameraOptions: FirstPersonCameraOptions = {
  enableCameraBob: false,
  cameraAcceleration: 0.25,
  useMomentum: true,
  maxMoveOperations: 5,
  usePhysics: true,
  enableJump: false,
  jumpHeight: 1,
  enableCollision: false,
  toggleLook: true,
  keyDownLook: true,
  lookToggleKeys: ["Escape"],
  lookHeldKeys: ["Mouse2"],
  forwardKeys: ["KeyW", "ArrowUp"],
  leftKeys: ["KeyA", "ArrowLeft"],
  backKeys: ["KeyS", "ArrowDown"],
  rightKeys: ["KeyD", "ArrowRight"],
  jumpKeys: ["Space"],
};


export class FirstPersonCamera extends Camera {
  lookToggle = true;
  movementSpeed = 1;
  options;

  constructor(scene: THREE.Scene, name: string, fov: number, near: number, far: number, position: position, rotation: rotation, movementSpeed: number, options = defaultFristPersonCameraOptions, physicsOptions: PhysicsOptions = defaultPhysicsOptions) {
    super(scene, name, fov, near, far, position, rotation, physicsOptions);
    this.translation = new THREE.Vector3(...this.camera.position);
    this.movementSpeed = movementSpeed;
    this.options = options;
    this.RegisterLook();
    this.RegisterLookToggle();
    this.RegisterMove();
  }

  Update() {
    super.Update();
    this.camera.position.lerp(this.translation, 0.15);
  }

  RegisterLookToggle() {
    if (this.options.toggleLook) {
      InputManager.RegisterHandler("keydown", () => {
        let keys = Array.from(InputManager.GetActiveKeys());
        if (keys.some((key) => this.options.lookToggleKeys.includes(key))) {
          this.lookToggle = !this.lookToggle;
        }
      });
    }
  }

  RegisterLook() {
    InputManager.RegisterHandler("mousemove", () => {
      let keys = Array.from(InputManager.GetActiveKeys());

      if (this.options.toggleLook && !this.lookToggle) return;
      if (this.options.keyDownLook && !keys.some((key) => this.options.lookHeldKeys.includes(key))) return;

      let direction = InputManager.GetMouseDirection();

      //Quaternion math that I don't understand
      let xHeight = direction.x / window.innerWidth;
      let yHeight = direction.y / window.innerHeight;

      this.phi += -xHeight * this.movementSpeed;
      this.theta = clamp(this.theta + -yHeight * this.movementSpeed, -Math.PI / 3, Math.PI / 3);

      let xQuaternion = new THREE.Quaternion();
      xQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);
      let yQuaternion = new THREE.Quaternion();
      yQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta);

      let quaternion = new THREE.Quaternion();
      quaternion.multiplyQuaternions(xQuaternion, yQuaternion);

      this.camera.rotation.setFromQuaternion(quaternion);
    });
  }

  RegisterMove() {
    InputManager.RegisterHandler("keydown", () => {
      let keys = Array.from(InputManager.GetActiveKeys());
      let movementFactor = 0.1;
      let forward = this.GetForwardVector(this.movementSpeed * movementFactor);
      let left = this.GetLeftVector(this.movementSpeed * movementFactor);

      //W,A,S,D
      if (keys.some((key) => this.options.forwardKeys.includes(key))) this.translation.add(forward);

      if (keys.some((key) => this.options.leftKeys.includes(key))) this.translation.add(left);

      if (keys.some((key) => this.options.backKeys.includes(key))) this.translation.sub(forward);

      if (keys.some((key) => this.options.rightKeys.includes(key))) this.translation.sub(left);

      if (this.options.enableJump && keys.some((key) => this.options.jumpKeys.includes(key))) this.Jump();
    });
  }

  Jump() {
    let up = new THREE.Vector3(0, 1, 0).multiplyScalar(this.options.jumpHeight);
    this.translation.add(up);
  }
}
