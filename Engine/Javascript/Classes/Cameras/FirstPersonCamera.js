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
exports.FirstPersonCamera = exports.defaultFristPersonCameraOptions = void 0;
const THREE = __importStar(require("three"));
const Camera_1 = require("./Camera");
const InputManager_1 = require("../Input/InputManager");
const MathUtils_1 = require("three/src/math/MathUtils");
const Physics_1 = require("../Base/Physics/Physics");
exports.defaultFristPersonCameraOptions = {
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
class FirstPersonCamera extends Camera_1.Camera {
    constructor(scene, name, fov, near, far, position, rotation, movementSpeed, options = exports.defaultFristPersonCameraOptions, physicsOptions = Physics_1.defaultPhysicsOptions) {
        super(scene, name, fov, near, far, position, rotation, physicsOptions);
        this.lookToggle = true;
        this.movementSpeed = 1;
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
            InputManager_1.InputManager.RegisterHandler("keydown", () => {
                let keys = Array.from(InputManager_1.InputManager.GetActiveKeys());
                if (keys.some((key) => this.options.lookToggleKeys.includes(key))) {
                    this.lookToggle = !this.lookToggle;
                }
            });
        }
    }
    RegisterLook() {
        InputManager_1.InputManager.RegisterHandler("mousemove", () => {
            let keys = Array.from(InputManager_1.InputManager.GetActiveKeys());
            if (this.options.toggleLook && !this.lookToggle)
                return;
            if (this.options.keyDownLook && !keys.some((key) => this.options.lookHeldKeys.includes(key)))
                return;
            let direction = InputManager_1.InputManager.GetMouseDirection();
            //Quaternion math that I don't understand
            let xHeight = direction.x / window.innerWidth;
            let yHeight = direction.y / window.innerHeight;
            this.phi += -xHeight * this.movementSpeed;
            this.theta = (0, MathUtils_1.clamp)(this.theta + -yHeight * this.movementSpeed, -Math.PI / 3, Math.PI / 3);
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
        InputManager_1.InputManager.RegisterHandler("keydown", () => {
            let keys = Array.from(InputManager_1.InputManager.GetActiveKeys());
            let movementFactor = 0.1;
            let forward = this.GetForwardVector(this.movementSpeed * movementFactor);
            let left = this.GetLeftVector(this.movementSpeed * movementFactor);
            //W,A,S,D
            if (keys.some((key) => this.options.forwardKeys.includes(key)))
                this.translation.add(forward);
            if (keys.some((key) => this.options.leftKeys.includes(key)))
                this.translation.add(left);
            if (keys.some((key) => this.options.backKeys.includes(key)))
                this.translation.sub(forward);
            if (keys.some((key) => this.options.rightKeys.includes(key)))
                this.translation.sub(left);
            if (this.options.enableJump && keys.some((key) => this.options.jumpKeys.includes(key)))
                this.Jump();
        });
    }
    Jump() {
        let up = new THREE.Vector3(0, 1, 0).multiplyScalar(this.options.jumpHeight);
        this.translation.add(up);
    }
}
exports.FirstPersonCamera = FirstPersonCamera;
