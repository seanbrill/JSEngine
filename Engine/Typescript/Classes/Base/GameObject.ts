import * as THREE from "three";
import { PhysicsEngine, PhysicsOptions, defaultPhysicsOptions } from "../Base/Physics/Physics";

export class GameObject {
  scene: THREE.Scene;
  name: string;
  tags: string[] = [];
  _object: THREE.Object3D | undefined;
  translation: THREE.Vector3 = new THREE.Vector3();
  PhysicsEngine: PhysicsEngine;
  phi: number = 0;
  theta: number = 0;

  constructor(scene: THREE.Scene, name: string, physicsOptions: PhysicsOptions = defaultPhysicsOptions) {
    this.scene = scene;
    this.name = name;
    this.PhysicsEngine = new PhysicsEngine(this, physicsOptions);
    this.Start();
  }

  Start() {
    console.log(`GAME_OBJECT:${this.name}`, this);
  }

  Update() {
    //set the physics engine's object if it exists
    if (this.PhysicsEngine._object == null && this._object != null) this.PhysicsEngine._object = this._object;

    this.Physics();
  }

  Physics() {
    if (!this._object) return;
    if (!this.PhysicsEngine.options.enabled) return;
    this.PhysicsEngine.CheckForCollisions();
    this.PhysicsEngine.Gravity();
  }

  /**
   * Gets the forward vetor for the specifed phi and magnitude,
   * useful for finding an Objects locl z reguardless of its rotation
   * @param {number} phi  - desc
   * @param {number} magnitude  - desc
   * @returns {THREE.Vector3}  desc
   */
  GetForwardVector(magnitude: number = 1): THREE.Vector3 {
    const qx = new THREE.Quaternion();
    //get the axis angle
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);
    //world space forward
    const forward = new THREE.Vector3(0, 0, -1);
    //apply the axis angle on the forward vector to get relative positive z direction
    forward.applyQuaternion(qx);
    //multiply the vecory by the magnitude
    forward.multiplyScalar(magnitude);
    return forward;
  }

  /**
   * Gets the forward vetor for the specifed phi and magnitude,
   * useful for finding an Objects locl z reguardless of its rotation
   * @param {number} phi  - desc
   * @param {number} magnitude  - desc
   * @returns {THREE.Vector3}  desc
   */
  GetLeftVector(magnitude: number = 1): THREE.Vector3 {
    const qx = new THREE.Quaternion();
    //get the axis angle
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi);
    //world space forward
    const left = new THREE.Vector3(-1, 0, 0);
    //apply the axis angle on the forward vector to get relative positive z direction
    left.applyQuaternion(qx);
    //multiply the vecory by the magnitude
    left.multiplyScalar(magnitude);
    return left;
  }
}
