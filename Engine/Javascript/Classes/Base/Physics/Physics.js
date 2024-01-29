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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicsEngine = exports.defaultPhysicsOptions = void 0;
const THREE = __importStar(require("three"));
exports.defaultPhysicsOptions = {
    enabled: true,
    mass: 1,
    useGravity: true,
    collisionEnabled: true,
};
class PhysicsEngine {
    constructor(classObject, physicsOptions = exports.defaultPhysicsOptions) {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.momentum = 0;
        this.collisions = [{ object: {}, direction: { x: 0, y: 0, z: 0 } }];
        this.classObject = classObject;
        this.options = physicsOptions;
    }
    CheckForCollisions() {
        if (!this.options.collisionEnabled || !this._object)
            return;
        this.collisions = [];
        // Create a helper object attached to the camera
        const helperObject = new THREE.Object3D();
        helperObject.position.copy(this._object.position);
        this._object.add(helperObject);
        //console.log("camera with object:", this._object);
        const box1 = new THREE.Box3().setFromObject(helperObject, true);
        const position1 = helperObject.position.clone();
        this.classObject.scene.appScene.traverse((object) => {
            if (object !== helperObject) {
                const box2 = new THREE.Box3().setFromObject(object, true);
                const position2 = object.position.clone();
                if (box1.intersectsBox(box2)) {
                    // Collision detected
                    const direction = new THREE.Vector3().subVectors(position2, position1).normalize();
                    this.collisions.push({ object, direction });
                    //console.log("Collision with", object);
                    //console.log("Collision direction:", direction);
                }
            }
        });
        // Remove the helper object from the camera
        this._object.remove(helperObject);
    }
    Gravity() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.collisions.find((x) => x.direction.y == -1)) {
                let down = new THREE.Vector3(...PhysicsEngine.Yaxis);
                this.acceleration.y -= PhysicsEngine.gravity;
                let vector = down.multiplyScalar(this.acceleration.y);
                let finalVector = new THREE.Vector3(...this.classObject.translation).add(vector);
                //this.classObject.translation.add(vector);
                //this._object.position.lerp(this.classObject.translation, 0.15);
            }
        });
    }
    CalcForce(mass, acceleration) {
        return mass * acceleration;
    }
}
exports.PhysicsEngine = PhysicsEngine;
//static fields
PhysicsEngine.gravity = 9.8;
PhysicsEngine.Xaxis = new THREE.Vector3(1, 0, 0);
PhysicsEngine.Yaxis = new THREE.Vector3(0, 1, 0);
PhysicsEngine.Zaxis = new THREE.Vector3(0, 0, 1);
