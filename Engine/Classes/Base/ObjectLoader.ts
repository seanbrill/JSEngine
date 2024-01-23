import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { scale, position, rotation, scale2D } from "./Interfaces";

export class ObjectLoader {
    scene: THREE.Scene;
    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    /**
  * Load a GLTF model with custom properties.
  * @param {string} modelPath - Path to the GLTF model file.
  * @param {Object} scale - Scale of the model in each dimension {x, y, z}.
  * @param {Object} position - Position of the model {x, y, z}.
  * @param {Object} rotation - Rotation of the model in radians {x, y, z}.
  * @param {Function} onLoadCallback - Callback function to execute when the model is loaded.
  * @param {Function} onErrorCallback - Callback function to execute if there is an error loading the model.
  */
    LoadGLTFModel(modelPath: string, scale: scale = { x: 1, y: 1, z: 1 }, position: scale = { x: 0, y: 0, z: 0 }, rotation: scale = { x: 0, y: 0, z: 0 }, onLoadCallback?: (model: THREE.Group<THREE.Object3DEventMap>) => any, onErrorCallback?: (error: any) => any): void {
        const loader = new GLTFLoader();

        loader.load(
            modelPath,
            (gltf) => {
                // Model loaded successfully
                const model = gltf.scene;

                // Set custom properties
                model.scale.set(scale.x, scale.y, scale.z);
                model.position.set(position.x, position.y, position.z);
                model.rotation.set(rotation.x, rotation.y, rotation.z);

                this.scene.add(model);

                // Execute onLoadCallback if provided
                if (onLoadCallback) {
                    onLoadCallback(model);
                }
            },
            (progress) => {
                // Loading progress
                console.log(`${(progress.loaded / progress.total) * 100}% loaded`);
            },
            (error) => {
                // Error loading model
                console.error("Error loading GLTF model", error);

                // Execute onErrorCallback if provided
                if (onErrorCallback) {
                    onErrorCallback(error);
                }
            }
        );
    }
}