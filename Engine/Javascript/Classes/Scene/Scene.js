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
exports.Scene = void 0;
const THREE = __importStar(require("three"));
const InputManager_1 = require("../Input/InputManager");
const CameraManager_1 = require("../Cameras/CameraManager");
const UIManager_1 = require("../UI/UIManager");
const PrimitiveHelpers_1 = require("../Base/PrimitiveHelpers");
const AudioManager_1 = require("../Audio/AudioManager");
class Scene {
    constructor(sceneName, trackFPS = false) {
        this.isActive = false;
        this.objects = [];
        this.frame = 0;
        this.frame_counter = 0;
        this.programStartTime = 0;
        this.fpsStartTime = 0;
        this.fpsCounter = null;
        this.fps = 0;
        this.avgFPS = 0;
        //time
        this.deltaTime = 0;
        this.currentTime = 0;
        this.sceneName = sceneName;
        this.trackFPS = trackFPS;
        this.appScene = new THREE.Scene();
        this.primitiveObjects = new PrimitiveHelpers_1.Primitives(this);
        this.inputManager = new InputManager_1.InputManager();
        this.cameraManager = new CameraManager_1.CameraManager(this);
        this.audioManager = new AudioManager_1.AudioManager(this);
        //resize scene to browser window
        window.addEventListener("resize", () => {
            var _a, _b;
            if (this.renderer != undefined && this.parent != undefined && ((_b = (_a = this.cameraManager) === null || _a === void 0 ? void 0 : _a.MainCamera) === null || _b === void 0 ? void 0 : _b.camera) instanceof THREE.PerspectiveCamera) {
                const newWidth = this.parent.clientWidth;
                const newHeight = this.parent.clientHeight;
                // Update renderer size
                this.renderer.setSize(newWidth, newHeight);
                // Update camera aspect ratio
                if (this.cameraManager && this.cameraManager.MainCamera) {
                    this.cameraManager.MainCamera.camera.aspect = newWidth / newHeight;
                    this.cameraManager.MainCamera.camera.updateProjectionMatrix();
                }
            }
        });
    }
    /**
     * Starts a scenes game loop
     * @returns {Promise<void>}  a promise that resolves after the first frame of the scene has run
     */
    Start(animateLogic = () => { }) {
        //prevent double starting a scene
        if (this.isActive) {
            return new Promise((resolve) => {
                return resolve();
            });
        }
        //reset fps stats if re-starting the scene
        this.frame = 0;
        this.frame_counter = 0;
        this.programStartTime = 0;
        this.isActive = true;
        return new Promise((resolve) => {
            const animate = () => {
                let timeStart = performance.now();
                if (this.frame === 0)
                    this.programStartTime = performance.now();
                this.Update();
                //Validate
                if (!this.cameraManager)
                    throw new Error("Three js camera must be initialized to start the scene");
                if (!this.cameraManager.MainCamera)
                    throw new Error("Three js camera must be initialized to start the scene");
                if (!this.cameraManager.MainCamera.camera)
                    throw new Error("Three js camera must be initialized to start the scene");
                if (!this.appScene)
                    throw new Error("Three js scene must be initialized to start the scene");
                if (!this.renderer)
                    throw new Error("Renderer must be initialized to start the scene");
                if (!this.isActive)
                    return;
                requestAnimationFrame(animate);
                if (this.trackFPS) {
                    if (this.frame === 0) {
                        this.fpsStartTime = this.programStartTime;
                    }
                    this.frame += 1;
                    this.frame_counter += 1;
                    this.CalculateFPS();
                }
                animateLogic();
                this.renderer.render(this.appScene, this.cameraManager.MainCamera.camera);
                this.cameraManager.Update();
                UIManager_1.UIManager.Update();
                this.deltaTime = (performance.now() - timeStart) / 1000;
            };
            //call animate the first time
            animate();
            resolve();
        });
    }
    /**
     * Stops the execution of further frames
     * @returns {void}  desc
     */
    Stop() {
        this.isActive = false;
    }
    /**
     * Logic to be executed once per frame
     * @returns {void}  desc
     */
    Update() {
        this.previousFrame = Object.assign({}, this);
    }
    /**
     * Shows the on screen fps counter
     * @returns {void}  desc
     */
    ShowFPS() {
        if (this.fpsCounter) {
            this.fpsCounter.style.display = "flex";
        }
    }
    /**
     * Updates the fps counter text and calculates the current and avaerage fps
     * @returns {void}  desc
     */
    CalculateFPS() {
        this.currentTime = performance.now();
        let totalElapsedTime = this.currentTime - this.programStartTime;
        let sinceLastRefresh = this.currentTime - this.fpsStartTime;
        if (!this.fpsStartTime)
            this.fpsStartTime = this.currentTime;
        //update avg fps every 1 seconds
        if (sinceLastRefresh >= 1000) {
            this.avgFPS = Math.floor(this.frame / (totalElapsedTime / 1000));
            this.fps = Math.floor(this.frame_counter / (sinceLastRefresh / 1000));
            this.frame_counter = 0;
            //reset relative start time
            this.fpsStartTime = this.currentTime;
        }
        //update fps counter text
        if (this.fpsCounter) {
            this.fpsCounter.innerText = `fps: ${this.fps}, \navg: ${this.avgFPS}`;
        }
    }
    /**
     * Hides the on screen fps counter
     * @returns {voide}  desc
     */
    HideFPS() {
        if (this.fpsCounter) {
            this.fpsCounter.style.display = "none";
        }
    }
}
exports.Scene = Scene;
