import * as THREE from "three";
import { scale, position, rotation, scale2D, primitive3DOptions, primitiveLightOptions, SkyboxOptions } from "./Interfaces";
import { Scene } from "../Scene/Scene";
import { GameObject } from "./GameObject";
import { PhysicsOptions, defaultPhysicsOptions } from "./Physics/Physics";

const skyboxDefaults: SkyboxOptions = {
  name: 'skybox',
  scale: { x: 1000, y: 1000, z: 1000 },
  color: '#76b1db', //skyblue
}
const ambientLightDefaults: primitiveLightOptions = {
  name: 'ambient-light',
  color: '#ffffff',
  intensity: 1
}
const pointLightDefaults: primitiveLightOptions = {
  name: 'point-light',
  color: '#ffffff',
  intensity: 1,
  distance: 2,
  decay: 2,
  position: { x: 0, y: 20, z: 0 }
}
const directionalLightDefaults: primitiveLightOptions = {
  name: 'directional-light',
  color: '#ffffff',
  intensity: 1,
  position: { x: 0, y: 20, z: 0 },
  target: { x: 0, y: 0, z: 0 }
}
const spotLightDefaults: primitiveLightOptions = {
  name: 'spot-light',
  color: '#ffffff',
  intensity: 1,
  position: { x: 0, y: 20, z: 0 },
  target: { x: 0, y: 0, z: 0 }
}
const cubeDefaults: primitive3DOptions = {
  name: 'cube',
  scale: { x: 1, y: 1, z: 1 },
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  color: '#ffffff',
  texturePath: null
}
const coneDefaults: primitive3DOptions = {
  name: 'cone',
  scale: { x: 1, y: 1, z: 1 },
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  color: '#ffffff',
  texturePath: null
}
const sphereDefaults: primitive3DOptions = {
  name: 'sphere',
  scale: { x: 1, y: 1, z: 1 },
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  color: '#ffffff',
  texturePath: null
}
const planeDefaults: primitive3DOptions = {
  name: 'cone',
  scale: { x: 1, y: 1, z: 1 },
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  color: '#ffffff',
  texturePath: null
}

export class Primitives {
  scene: Scene;
  constructor(scene: Scene) {
    this.scene = scene;
  }

  /**
     * Creates a skybox with the specified options
     * @param {SkyboxOptions} options - properties of the skybox
     * @param {boolean} instantiate - boolean that determines if the created object is automatically added to the scene
     * @returns {GameObject} - the created skybox
     */
  CreateSkyBox(options: SkyboxOptions, instantiate: boolean = true): GameObject {
    // Check if texturePath is provided
    let material;
    if (options.texturePath) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(options.texturePath);
      // Repeat texture in both directions
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // how many times to repeat in each direction; the default is (1,1),
      texture.repeat.set(options.textureRepeat?.x ?? 1, options.textureRepeat?.y ?? 1);
      // Use MeshStandardMaterial for realistic lighting with textures
      material = new THREE.MeshStandardMaterial({ map: texture, color: options.color ? new THREE.Color(options.color) : 0x00ff00, side: THREE.BackSide });

    } else {
      // Use basic material with color if no texturePath is provided
      material = new THREE.MeshBasicMaterial({ color: options.color ? new THREE.Color(options.color) : 0x00ff00, side: THREE.BackSide });
    }
    let box = new THREE.BoxGeometry(options.scale.x, options.scale.y, options.scale.z)
    let skybox = new THREE.Mesh(box, material);
    let gameObject = new GameObject(this.scene, options.name, skybox)
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
  CreateAmbientLight(options: primitiveLightOptions = ambientLightDefaults, instantiate: boolean = true): GameObject {
    let light = new THREE.AmbientLight(options.color, options.intensity);
    let gameObject = new GameObject(this.scene, options.name, light);
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
  CreatePointLight(options: primitiveLightOptions = pointLightDefaults, instantiate: boolean = true): GameObject {
    let light = new THREE.PointLight(options.color, options.intensity, options.distance, options.decay);
    if (options.position) light.position.copy(new THREE.Vector3(options.position.x, options.position.y, options.position.z));
    let gameObject = new GameObject(this.scene, options.name, light);
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
  CreateDirectionalLight(options: primitiveLightOptions = directionalLightDefaults, instantiate: boolean = true): GameObject {
    let light = new THREE.DirectionalLight(options.color, options.intensity);
    light.lookAt(new THREE.Vector3(options.target?.x, options.target?.y, options.target?.z))
    if (options.position) light.position.copy(new THREE.Vector3(options.position.x, options.position.y, options.position.z));
    let gameObject = new GameObject(this.scene, options.name, light);
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
  CreateSpotLight(options: primitiveLightOptions = spotLightDefaults, instantiate: boolean = true): GameObject {
    let light = new THREE.SpotLight(options.color, options.intensity, options.distance, options.angle, options.penumbra, options.decay);
    light.lookAt(new THREE.Vector3(options.target?.x, options.target?.y, options.target?.z))
    if (options.position) light.position.copy(new THREE.Vector3(options.position.x, options.position.y, options.position.z));
    let gameObject = new GameObject(this.scene, options.name, light);
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
  CreateCube(options: primitive3DOptions = cubeDefaults, physicsOptions: PhysicsOptions = defaultPhysicsOptions, instantiate: boolean = true): GameObject {
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
      texture.repeat.set(options.textureRepeat?.x ?? 1, options.textureRepeat?.y ?? 1);
      // Use MeshStandardMaterial for realistic lighting with textures
      material = new THREE.MeshStandardMaterial({ map: texture, color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
    } else {
      // Use basic material with color if no texturePath is provided
      material = new THREE.MeshBasicMaterial({ color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
    }

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(options.position.x, options.position.y, options.position.z);
    cube.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);

    let gameObject = new GameObject(this.scene, options.name, cube, physicsOptions)
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
  CreateSphere(options: primitive3DOptions = sphereDefaults, physicsOptions: PhysicsOptions = defaultPhysicsOptions, instantiate: boolean = true): GameObject {
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
      texture.repeat.set(options.textureRepeat?.x ?? 1, options.textureRepeat?.y ?? 1);
      // Use MeshStandardMaterial for realistic lighting with textures
      material = new THREE.MeshStandardMaterial({ map: texture, color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
    } else {
      // Use basic material with color if no texturePath is provided
      material = new THREE.MeshBasicMaterial({ color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
    }

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(options.position.x, options.position.y, options.position.z);
    sphere.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);

    let gameObject = new GameObject(this.scene, options.name, sphere, physicsOptions)
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
  CreateCone(options: primitive3DOptions = coneDefaults, physicsOptions: PhysicsOptions = defaultPhysicsOptions, instantiate: boolean = true): GameObject {
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
      texture.repeat.set(options.textureRepeat?.x ?? 1, options.textureRepeat?.y ?? 1);

      // Use MeshStandardMaterial for realistic lighting with textures
      material = new THREE.MeshStandardMaterial({ map: texture, color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
    } else {
      // Use basic material with color if no texturePath is provided
      material = new THREE.MeshBasicMaterial({ color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
    }

    const cone = new THREE.Mesh(geometry, material);
    cone.position.set(options.position.x, options.position.y, options.position.z);
    cone.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);

    let gameObject = new GameObject(this.scene, options.name, cone, physicsOptions);
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
  CreatePlane(options: primitive3DOptions = planeDefaults, physicsOptions: PhysicsOptions = defaultPhysicsOptions, instantiate: boolean = true): GameObject {
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
      texture.repeat.set(options.textureRepeat?.x ?? 1, options.textureRepeat?.y ?? 1);

      // Use MeshStandardMaterial for realistic lighting with textures
      material = new THREE.MeshStandardMaterial({ map: texture, color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
    } else {
      // Use basic material with color if no texturePath is provided
      material = new THREE.MeshBasicMaterial({ color: options.color ? new THREE.Color(options.color) : 0x00ff00 });
    }

    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(options.position.x, options.position.y, options.position.z);
    plane.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);

    let gameObject = new GameObject(this.scene, options.name, plane, physicsOptions);
    if (instantiate) {
      gameObject.Instantiate();
    }
    return gameObject;
  }


}
