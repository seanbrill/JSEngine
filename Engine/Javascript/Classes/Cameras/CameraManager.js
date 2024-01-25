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
exports.CameraManager = void 0;
const FirstPersonCamera_1 = require("./FirstPersonCamera");
const Camera_1 = require("./Camera");
const THREE = __importStar(require("three"));
const Physics_1 = require("../Base/Physics/Physics");
class CameraManager {
    constructor(scene) {
        this.cameras = [];
        this.activeIndex = 0;
        this.MainCamera = null;
        this.scene = scene;
    }
    Update() {
        this.cameras.forEach((camera) => camera.Update());
    }
    //Camera Types
    CreateCamera(name, fov, near, far, pos, rot) {
        // Use default values if parameters are not provided
        name = name || "DefaultCamera";
        fov = fov === undefined ? 75 : fov;
        near = near === undefined ? 0.1 : near;
        far = far === undefined ? 1000 : far;
        let cam = new Camera_1.Camera(this.scene, name, fov, near, far, pos, rot);
        this.cameras.push(cam);
        if (this.scene instanceof THREE.Scene) {
            this.scene.add(cam.camera);
            if (!this.MainCamera)
                this.MainCamera = cam;
        }
    }
    CreateFirstPersonCamera(name, fov, near, far, pos, rot, movementSpeed, options = FirstPersonCamera_1.defaultFristPersonCameraOptions, physicsOptions = Physics_1.defaultPhysicsOptions) {
        let cam = new FirstPersonCamera_1.FirstPersonCamera(this.scene, name, fov, near, far, pos, rot, movementSpeed, options, physicsOptions);
        this.cameras.push(cam);
        if (this.scene instanceof THREE.Scene) {
            this.scene.add(cam.camera);
            if (!this.MainCamera)
                this.MainCamera = cam;
        }
    }
    CreateThirdPersonCamera() { }
    CreateFreeFlyCamera() { }
    CreateOrbitCamera() { }
    NextCamera() {
        if (this.activeIndex + 1 < this.cameras.length)
            this.activeIndex++;
        this.MainCamera = this.cameras[this.activeIndex];
    }
    PreviousCamera() {
        if (this.activeIndex - 1 >= 0)
            this.activeIndex--;
        this.MainCamera = this.cameras[this.activeIndex];
    }
    SetActiveCameraIndex(index) {
        if (index >= 0 && index < this.cameras.length) {
            let cam = this.cameras[index];
            if (cam) {
                this.activeIndex = index;
                this.MainCamera = cam;
            }
            else {
                console.log("camera was null");
            }
        }
        else {
            throw new Error("Camera Index Out Of Bounds!");
        }
    }
    SetActiveCameraByName(name) {
        let cam = this.cameras.find((x) => x.name == name);
        if (cam) {
            this.activeIndex = this.cameras.indexOf(cam);
            this.MainCamera = cam;
        }
        else {
            throw new Error("No Camera With Matching Name!");
        }
    }
}
exports.CameraManager = CameraManager;
