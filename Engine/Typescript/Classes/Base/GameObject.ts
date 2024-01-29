import * as THREE from "three";
import { PhysicsEngine, PhysicsOptions, defaultPhysicsOptions } from "../Base/Physics/Physics";
import { Scene } from "../Scene/Scene";

export class GameObject {
  scene: Scene;
  name: string;
  tags: string[] = [];
  animations: THREE.AnimationClip[] = [];
  _object: THREE.Object3D | undefined;
  translation: THREE.Vector3 = new THREE.Vector3();
  PhysicsEngine: PhysicsEngine;
  phi: number = 0;
  theta: number = 0;
  isActive: boolean = true;

  constructor(scene: Scene, name: string, object: THREE.Object3D | null = null, physicsOptions: PhysicsOptions = defaultPhysicsOptions) {
    this.scene = scene;
    this.name = name;
    if (object) this._object = object;
    this.PhysicsEngine = new PhysicsEngine(this, physicsOptions);
    this.Start();
  }

  /**
   * Called immediately on instantiation 
   * @returns {void}
   */
  Start(): void {
    console.log(`GAME_OBJECT:${this.name}`, this);
  }

  /**
  * Spawns the 3D object into the appScene 
  * @returns {void}
  */
  Instantiate(): void {
    //add to the 3d scene
    if (this._object) {
      this.scene.appScene.add(this._object);
    }
    //add reference to this class object to the active scene
    this.scene.objects.push(this);
  }

  /**
   * Sets this GameObject to inactive, removes the associated 3d object 
   * from 3d appScene. Executes OnDestroy 
   * @returns {void}
   */
  Destroy(): void {
    this.OnDestroy();
    if (this._object) {
      //remove the physical object from the three js scene
      this.scene.appScene.remove(this._object);
    }
    //remove this GameObject from the object array of the scene
    let index = this.scene.objects.indexOf(this);
    this.scene.objects.splice(index, 1);
    //set to inactive
    this.isActive = false;
  }

  /**
  * A function to execute when the Destroy() method on this GameObject has been called
  * @returns {void}
  */
  OnDestroy(): void { }

  /**
  * Managed by the scene ticks the logic sequence for this Object 
  * @returns {void}
  */
  Update(): void {
    if (!this.isActive) return;
    //set the physics engine's object if it exists
    if (this.PhysicsEngine._object == null && this._object != null) this.PhysicsEngine._object = this._object;
    this.Physics();
  }

  /**
   * Base Physics implmentation, executed only if physics on this object is enabled
   * allows this GameObject to interface with the Physics Engine.
   * @returns {void}
   */
  Physics(): void {
    if (!this._object) return;
    if (!this.PhysicsEngine.options.enabled) return;
    this.PhysicsEngine.CheckForCollisions();
    this.PhysicsEngine.Gravity();
  }

  /**
   * Adds a tag to this objects tag array, tags can be used to add a type of identifier
   * for objects to allow some logic to br made easier. Example tag of enemy where only
   * GameObjects with tag Enemy is affected by your attack
   * @param {string} tag  - the name of the tag you wish to remove
   * @returns {void}
   */
  AddTag(tag: string): void {
    if (!this.tags.includes(tag)) this.tags.push(tag)
  }

  /**
   * Removes a tag from this objects tag array
   * @param {string} tag  - the name of the tag you wish to remove
   * @returns {void}
   */
  RemoveTag(tag: string): void {
    let index = this.tags.indexOf(tag)
    if (index > -1) {
      this.tags.splice(index, 1)
    }
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
