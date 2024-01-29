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
exports.Camera = void 0;
const THREE = __importStar(require("three"));
const GameObject_1 = require("../Base/GameObject");
const Physics_1 = require("../Base/Physics/Physics");
class Camera extends GameObject_1.GameObject {
    constructor(scene, name, fov, near, far, position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }, physicsOptions = Physics_1.defaultPhysicsOptions) {
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
    TeleportTo(destination) { }
    TransitionTo(destination, time) { }
}
exports.Camera = Camera;
