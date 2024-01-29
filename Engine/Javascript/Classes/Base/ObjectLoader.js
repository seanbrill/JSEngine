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
exports.ObjectLoader = void 0;
const THREE = __importStar(require("three"));
const GLTFLoader_1 = require("three/examples/jsm/loaders/GLTFLoader");
const GameObject_1 = require("./GameObject");
const Physics_1 = require("./Physics/Physics");
class ObjectLoader {
    constructor(scene) {
        this.scene = scene;
    }
    /**
        * Asynchronously load in a gltf model
        * @param {ObjectLoaderOptions} options
        * @param {PhysicsOptions} physicsOptions - Physics options to be applied to the created GameObject
        * @param {boolean} instantiate - boolean that determines if the created object is automatically added to the scene
        * @returns {GameObject} - the created gltf
        */
    LoadGLTFModel(options, physicsOptions = Physics_1.defaultPhysicsOptions, instantiate = true) {
        const loader = new GLTFLoader_1.GLTFLoader();
        loader.load(options.modelPath, (gltf) => {
            var _a, _b, _c, _d;
            // Model loaded successfully
            let animations = [];
            if (gltf.animations) {
                animations = gltf.animations;
            }
            const model = gltf.scene;
            // Set custom properties
            model.scale.set(options.scale.x, options.scale.y, options.scale.z);
            model.position.set(options.position.x, options.position.y, options.position.z);
            model.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
            // Check if texturePath is provided
            let material;
            if (options.texturePath) {
                const textureLoader = new THREE.TextureLoader();
                const texture = textureLoader.load(options.texturePath);
                // Repeat texture in both directions
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                // how many times to repeat in each direction; the default is (1,1),
                texture.repeat.set((_b = (_a = options.textureRepeat) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 1, (_d = (_c = options.textureRepeat) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 1);
                // Use MeshStandardMaterial for realistic lighting with textures
                material = new THREE.MeshStandardMaterial({ map: texture, color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
            }
            else {
                // Use basic material with color if no texturePath is provided
                material = new THREE.MeshBasicMaterial({ color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
            }
            //set material on object
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });
            let gameObject = new GameObject_1.GameObject(this.scene, options.name, model, physicsOptions);
            if (animations.length > 0) {
                gameObject.animations = animations;
            }
            this.scene.appScene.add(model);
            if (instantiate) {
                gameObject.Instantiate();
            }
            // Execute onLoadCallback if provided
            if (options.onLoad) {
                options.onLoad(gameObject);
            }
        }, (progress) => {
            if (options.onProgress)
                options.onProgress(progress);
        }, (error) => {
            if (options.onError) {
                options.onError(error);
            }
        });
    }
}
exports.ObjectLoader = ObjectLoader;
