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
exports.SceneManager = void 0;
const THREE = __importStar(require("three"));
const Scene_1 = require("./Scene");
const UIManager_1 = require("../UI/UIManager");
class SceneManager {
    constructor() {
        this.scenes = [];
        this.activeSceneIndex = 0;
        if (!window.ActiveSceneManagers) {
            window.ActiveSceneManagers = [this];
        }
        else {
            window.ActiveSceneManagers.push(this);
        }
        this.UIManager = new UIManager_1.UIManager();
    }
    /**
     * Creates a new scene object and adds to the static array of scenes
     * @param {HTMLElement} parentNode  - the parent html element to create a scene on
     * @param {string} sceneName  - the name of the scene to create
     * @param {boolean} defaultCamera  - a boolean to create a standard camera or not
     * @param {boolean} defaultLight  - a boolean to create a standard light or not
     * @param {boolean} trackFPS  - a boolean to track fps or not, will slightly affect performance
     * @returns {void}  desc
     */
    CreateScene(parentNode, sceneName, defaultCamera = true, defaultLight = true, trackFPS = true) {
        //prevent duplicate scene from instantiating
        if (this.scenes.find((x) => x.sceneName == sceneName))
            return;
        if (!parentNode)
            return;
        //create scene object
        let new_scene = new Scene_1.Scene(sceneName, trackFPS);
        //create a canvas element
        new_scene.parent = parentNode;
        new_scene.canvas = document.createElement("canvas");
        new_scene.canvas.id = sceneName;
        new_scene.parent.appendChild(new_scene.canvas);
        new_scene.canvas.addEventListener("contextmenu", function (event) {
            event.preventDefault();
        });
        //create a camera for the scene if a default one is specified
        if (defaultCamera) {
            new_scene.cameraManager.CreateCamera();
        }
        //create a default light source
        if (defaultLight) {
            new_scene.primitiveObjects.CreateAmbientLight();
        }
        new_scene.renderer = new THREE.WebGLRenderer({ canvas: new_scene.canvas, antialias: true, powerPreference: "high-performance" });
        new_scene.renderer.setSize(parentNode.clientWidth, parentNode.clientHeight);
        //setup fps ui
        if (trackFPS) {
            let existing_counter = document.querySelector("#" + new_scene.sceneName + "-fps-counter");
            if (existing_counter) {
                new_scene.fpsCounter = existing_counter;
                return;
            }
            new_scene.fpsCounter = document.createElement("span");
            new_scene.fpsCounter.id = new_scene.sceneName + "-fps-counter";
            document.body.appendChild(new_scene.fpsCounter);
            new_scene.fpsCounter.innerText = `fps: ${new_scene.fps}, avg: ${new_scene.avgFPS}`;
            new_scene.fpsCounter.style.position = "absolute";
            new_scene.fpsCounter.style.top = "5px";
            new_scene.fpsCounter.style.left = "5px";
            new_scene.fpsCounter.style.color = "#3ab3ff";
        }
        this.scenes.push(new_scene);
        if (this.activeScene == null)
            this.activeScene = new_scene;
    }
    NextScene() {
        if (this.activeSceneIndex + 1 <= this.scenes.length) {
            this.activeSceneIndex += 1;
            if (this.activeScene)
                this.activeScene.Stop();
            this.activeScene = this.scenes[this.activeSceneIndex];
            this.activeScene.Start();
        }
    }
    PreviousScene() {
        if (this.activeSceneIndex - 1 >= 0) {
            this.activeSceneIndex -= 1;
            if (this.activeScene)
                this.activeScene.Stop();
            this.activeScene = this.scenes[this.activeSceneIndex];
            this.activeScene.Start();
        }
    }
    LoadScene(sceneName) {
        let targetScene = this.scenes.find((x) => x.sceneName == sceneName);
        if (targetScene) {
            this.activeSceneIndex = this.scenes.indexOf(targetScene);
            if (this.activeScene)
                this.activeScene.Stop();
            this.activeScene = targetScene;
            this.activeScene.Start();
        }
    }
}
exports.SceneManager = SceneManager;
