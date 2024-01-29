"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const THREE = __importStar(require("three"));
const Physics_1 = require("../Base/Physics/Physics");
class GameObject {
    constructor(scene, name, object = null, physicsOptions = Physics_1.defaultPhysicsOptions) {
        this.tags = [];
        this.animations = [];
        this.translation = new THREE.Vector3();
        this.phi = 0;
        this.theta = 0;
        this.isActive = true;
        this.scene = scene;
        this.name = name;
        if (object)
            this._object = object;
        this.PhysicsEngine = new Physics_1.PhysicsEngine(this, physicsOptions);
        this.Start();
    }
    /**
     * Called immediately on instantiation
     * @returns {void}
     */
    Start() {
        console.log(`GAME_OBJECT:${this.name}`, this);
    }
    /**
    * Spawns the 3D object into the appScene
    * @returns {void}
    */
    Instantiate() {
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
    Destroy() {
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
    OnDestroy() { }
    /**
    * Managed by the scene ticks the logic sequence for this Object
    * @returns {void}
    */
    Update() {
        if (!this.isActive)
            return;
        //set the physics engine's object if it exists
        if (this.PhysicsEngine._object == null && this._object != null)
            this.PhysicsEngine._object = this._object;
        this.Physics();
    }
    /**
     * Base Physics implmentation, executed only if physics on this object is enabled
     * allows this GameObject to interface with the Physics Engine.
     * @returns {void}
     */
    Physics() {
        if (!this._object)
            return;
        if (!this.PhysicsEngine.options.enabled)
            return;
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
    AddTag(tag) {
        if (!this.tags.includes(tag))
            this.tags.push(tag);
    }
    /**
     * Removes a tag from this objects tag array
     * @param {string} tag  - the name of the tag you wish to remove
     * @returns {void}
     */
    RemoveTag(tag) {
        let index = this.tags.indexOf(tag);
        if (index > -1) {
            this.tags.splice(index, 1);
        }
    }
    /**
     * Gets the forward vetor for the specifed phi and magnitude,
     * useful for finding an Objects locl z reguardless of its rotation
     * @param {number} phi  - desc
     * @param {number} magnitude  - desc
     * @returns {THREE.Vector3}  desc
     */
    GetForwardVector(magnitude = 1) {
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
    GetLeftVector(magnitude = 1) {
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
exports.GameObject = GameObject;
