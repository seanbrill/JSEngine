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
exports.Primitives = void 0;
const THREE = __importStar(require("three"));
const GameObject_1 = require("./GameObject");
const Physics_1 = require("./Physics/Physics");
const skyboxDefaults = {
    name: 'skybox',
    scale: { x: 1000, y: 1000, z: 1000 },
    color: '#76b1db', //skyblue
};
const ambientLightDefaults = {
    name: 'ambient-light',
    color: '#ffffff',
    intensity: 1
};
const pointLightDefaults = {
    name: 'point-light',
    color: '#ffffff',
    intensity: 1,
    distance: 2,
    decay: 2,
    position: { x: 0, y: 20, z: 0 }
};
const directionalLightDefaults = {
    name: 'directional-light',
    color: '#ffffff',
    intensity: 1,
    position: { x: 0, y: 20, z: 0 },
    target: { x: 0, y: 0, z: 0 }
};
const spotLightDefaults = {
    name: 'spot-light',
    color: '#ffffff',
    intensity: 1,
    position: { x: 0, y: 20, z: 0 },
    target: { x: 0, y: 0, z: 0 }
};
const cubeDefaults = {
    name: 'cube',
    scale: { x: 1, y: 1, z: 1 },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    color: '#ffffff',
    texturePath: null
};
const coneDefaults = {
    name: 'cone',
    scale: { x: 1, y: 1, z: 1 },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    color: '#ffffff',
    texturePath: null
};
const sphereDefaults = {
    name: 'sphere',
    scale: { x: 1, y: 1, z: 1 },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    color: '#ffffff',
    texturePath: null
};
const planeDefaults = {
    name: 'cone',
    scale: { x: 1, y: 1, z: 1 },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    color: '#ffffff',
    texturePath: null
};
class Primitives {
    constructor(scene) {
        this.scene = scene;
    }
    /**
       * Creates a skybox with the specified options
       * @param {SkyboxOptions} options - properties of the skybox
       * @param {boolean} instantiate - boolean that determines if the created object is automatically added to the scene
       * @returns {GameObject} - the created skybox
       */
    CreateSkyBox(options, instantiate = true) {
        var _a, _b, _c, _d;
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
            material = new THREE.MeshStandardMaterial({ map: texture, color: options.color ? new THREE.Color(options.color) : 0x00ff00, side: THREE.BackSide });
        }
        else {
            // Use basic material with color if no texturePath is provided
            material = new THREE.MeshBasicMaterial({ color: options.color ? new THREE.Color(options.color) : 0x00ff00, side: THREE.BackSide });
        }
        let box = new THREE.BoxGeometry(options.scale.x, options.scale.y, options.scale.z);
        let skybox = new THREE.Mesh(box, material);
        let gameObject = new GameObject_1.GameObject(this.scene, options.name, skybox);
        if (instantiate) {
            gameObject.Instantiate();
        }
        return gameObject;
    }
    /**
     * Provides overall, uniform illumination to the entire scene.
     * @param {primitiveLightOptions} options - properties of the ambient light
     * @returns {GameObject} - the created ambient light
     */
    CreateAmbientLight(options = ambientLightDefaults, instantiate = true) {
        let light = new THREE.AmbientLight(options.color, options.intensity);
        let gameObject = new GameObject_1.GameObject(this.scene, options.name, light);
        if (instantiate) {
            gameObject.Instantiate();
        }
        return gameObject;
    }
    /**
     * Represents a light source that emits light in all directions from a single point.
     * @param {primitiveLightOptions} options - properties of the ambient light
     * @returns {GameObject} - the created point light
     */
    CreatePointLight(options = pointLightDefaults, instantiate = true) {
        let light = new THREE.PointLight(options.color, options.intensity, options.distance, options.decay);
        if (options.position)
            light.position.copy(new THREE.Vector3(options.position.x, options.position.y, options.position.z));
        let gameObject = new GameObject_1.GameObject(this.scene, options.name, light);
        if (instantiate) {
            gameObject.Instantiate();
        }
        return gameObject;
    }
    /**
     * Represents a light source that emits light in parallel rays from a given direction.
     * @param {primitiveLightOptions} options - properties of the ambient light
     * @param {boolean} instantiate - boolean that determines if the created object is automatically added to the scene
     * @returns {GameObject} - the created directional light
     */
    CreateDirectionalLight(options = directionalLightDefaults, instantiate = true) {
        var _a, _b, _c;
        let light = new THREE.DirectionalLight(options.color, options.intensity);
        light.lookAt(new THREE.Vector3((_a = options.target) === null || _a === void 0 ? void 0 : _a.x, (_b = options.target) === null || _b === void 0 ? void 0 : _b.y, (_c = options.target) === null || _c === void 0 ? void 0 : _c.z));
        if (options.position)
            light.position.copy(new THREE.Vector3(options.position.x, options.position.y, options.position.z));
        let gameObject = new GameObject_1.GameObject(this.scene, options.name, light);
        if (instantiate) {
            gameObject.Instantiate();
        }
        return gameObject;
    }
    /**
     * Represents a light source that emits light within a cone-shaped region.
     * @param {primitiveLightOptions} options - properties of the ambient light
     * @param {boolean} instantiate - boolean that determines if the created object is automatically added to the scene
     * @returns {GameObject} - the created spot light
     */
    CreateSpotLight(options = spotLightDefaults, instantiate = true) {
        var _a, _b, _c;
        let light = new THREE.SpotLight(options.color, options.intensity, options.distance, options.angle, options.penumbra, options.decay);
        light.lookAt(new THREE.Vector3((_a = options.target) === null || _a === void 0 ? void 0 : _a.x, (_b = options.target) === null || _b === void 0 ? void 0 : _b.y, (_c = options.target) === null || _c === void 0 ? void 0 : _c.z));
        if (options.position)
            light.position.copy(new THREE.Vector3(options.position.x, options.position.y, options.position.z));
        let gameObject = new GameObject_1.GameObject(this.scene, options.name, light);
        if (instantiate) {
            gameObject.Instantiate();
        }
        return gameObject;
    }
    /**
     * Create a cube with custom properties.
     * @param {primitive3DOptions} options
     * @param {PhysicsOptions} physicsOptions - Physics options to be applied to the created GameObject
     * @param {boolean} instantiate - boolean that determines if the created object is automatically added to the scene
     * @returns {GameObject} - the created cube
     */
    CreateCube(options = cubeDefaults, physicsOptions = Physics_1.defaultPhysicsOptions, instantiate = true) {
        var _a, _b, _c, _d;
        const geometry = new THREE.BoxGeometry(options.scale.x, options.scale.y, options.scale.z);
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
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(options.position.x, options.position.y, options.position.z);
        cube.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
        let gameObject = new GameObject_1.GameObject(this.scene, options.name, cube, physicsOptions);
        if (instantiate) {
            gameObject.Instantiate();
        }
        return gameObject;
    }
    /**
       * Create a sphere with custom properties.
       * @param {primitive3DOptions} options
       * @param {PhysicsOptions} physicsOptions - Physics options to be applied to the created GameObject
       * @param {boolean} instantiate - boolean that determines if the created object is automatically added to the scene
       * @returns {GameObject} - the created sphere
       */
    CreateSphere(options = sphereDefaults, physicsOptions = Physics_1.defaultPhysicsOptions, instantiate = true) {
        var _a, _b, _c, _d;
        const geometry = new THREE.SphereGeometry(options.scale.x, options.scale.y, options.scale.z);
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
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(options.position.x, options.position.y, options.position.z);
        sphere.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
        let gameObject = new GameObject_1.GameObject(this.scene, options.name, sphere, physicsOptions);
        if (instantiate) {
            gameObject.Instantiate();
        }
        return gameObject;
    }
    /**
    * Create a cone with custom properties.
    * @param {primitive3DOptions} options
    * @param {PhysicsOptions} physicsOptions - Physics options to be applied to the created GameObject
    * @param {boolean} instantiate - boolean that determines if the created object is automatically added to the scene
    * @returns {GameObject} - the created cone
    */
    CreateCone(options = coneDefaults, physicsOptions = Physics_1.defaultPhysicsOptions, instantiate = true) {
        var _a, _b, _c, _d;
        const geometry = new THREE.ConeGeometry(options.scale.x, options.scale.y, options.scale.z);
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
        const cone = new THREE.Mesh(geometry, material);
        cone.position.set(options.position.x, options.position.y, options.position.z);
        cone.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
        let gameObject = new GameObject_1.GameObject(this.scene, options.name, cone, physicsOptions);
        if (instantiate) {
            gameObject.Instantiate();
        }
        return gameObject;
    }
    /**
     * Create a plane with custom properties.
     * @param {primitive3DOptions} options
     * @param {PhysicsOptions} physicsOptions - Physics options to be applied to the created GameObject
     * @param {boolean} instantiate - boolean that determines if the created object is automatically added to the scene
     * @returns {GameObject} - the created cone
     */
    CreatePlane(options = planeDefaults, physicsOptions = Physics_1.defaultPhysicsOptions, instantiate = true) {
        var _a, _b, _c, _d;
        const geometry = new THREE.PlaneGeometry(options.scale.x, options.scale.z);
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
        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(options.position.x, options.position.y, options.position.z);
        plane.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
        let gameObject = new GameObject_1.GameObject(this.scene, options.name, plane, physicsOptions);
        if (instantiate) {
            gameObject.Instantiate();
        }
        return gameObject;
    }
}
exports.Primitives = Primitives;
