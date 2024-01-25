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
    constructor(scene, name, physicsOptions = Physics_1.defaultPhysicsOptions) {
        this.tags = [];
        this.translation = new THREE.Vector3();
        this.phi = 0;
        this.theta = 0;
        this.scene = scene;
        this.name = name;
        this.PhysicsEngine = new Physics_1.PhysicsEngine(this, physicsOptions);
        this.Start();
    }
    Start() {
        console.log(`GAME_OBJECT:${this.name}`, this);
    }
    Update() {
        //set the physics engine's object if it exists
        if (this.PhysicsEngine._object == null && this._object != null)
            this.PhysicsEngine._object = this._object;
        this.Physics();
    }
    Physics() {
        if (!this._object)
            return;
        if (!this.PhysicsEngine.options.enabled)
            return;
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
