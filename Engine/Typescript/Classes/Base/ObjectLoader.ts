import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { scale, position, rotation, scale2D } from "./Interfaces";
import { Scene } from "../Scene/Scene";
import { ObjectLoaderOptions } from "./Interfaces";
import { GameObject } from "./GameObject";
import { PhysicsOptions, defaultPhysicsOptions } from "./Physics/Physics";

export class ObjectLoader {
    scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
        * Asynchronously load in a gltf model
        * @param {ObjectLoaderOptions} options 
        * @param {PhysicsOptions} physicsOptions - Physics options to be applied to the created GameObject
        * @param {boolean} instantiate - boolean that determines if the created object is automatically added to the scene
        * @returns {GameObject} - the created gltf
        */
    LoadGLTFModel(options: ObjectLoaderOptions, physicsOptions: PhysicsOptions = defaultPhysicsOptions, instantiate: boolean = true) {
        const loader = new GLTFLoader();
        loader.load(
            options.modelPath,
            (gltf) => {
                // Model loaded successfully
                let animations: THREE.AnimationClip[] = [];
                if (gltf.animations) {
                    animations = gltf.animations;
                }
                const model = gltf.scene;

                // Set custom properties
                model.scale.set(options.scale.x, options.scale.y, options.scale.z);
                model.position.set(options.position.x, options.position.y, options.position.z);
                model.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);

                // Check if texturePath is provided
                let material: THREE.Material;
                if (options.texturePath) {
                    const textureLoader = new THREE.TextureLoader();
                    const texture = textureLoader.load(options.texturePath);
                    // Repeat texture in both directions
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    // how many times to repeat in each direction; the default is (1,1),
                    texture.repeat.set(options.textureRepeat?.x ?? 1, options.textureRepeat?.y ?? 1);
                    // Use MeshStandardMaterial for realistic lighting with textures
                    material = new THREE.MeshStandardMaterial({ map: texture, color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
                } else {
                    // Use basic material with color if no texturePath is provided
                    material = new THREE.MeshBasicMaterial({ color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
                }
                //set material on object
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                    }
                });

                let gameObject = new GameObject(this.scene, options.name, model, physicsOptions);
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
            },
            (progress) => {
                if (options.onProgress) options.onProgress(progress);
            },
            (error) => {
                if (options.onError) {
                    options.onError(error);
                }
            }
        );
    }


}