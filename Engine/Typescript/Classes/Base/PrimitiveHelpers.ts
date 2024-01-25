import * as THREE from "three";
import { scale, position, rotation, scale2D } from "./Interfaces";

export class Primitives {
  scene: THREE.Scene;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }
  /**
   * Create an ambient light with custom properties.
   * @param {Object} color - Color of the light in hex format.
   * @returns {THREE.AmbientLight} - The created ambient light.
   */
  CreateAmbientLight(color: string): THREE.AmbientLight {
    return new THREE.AmbientLight(color);
  }

  /**
   * Create a point light with custom properties.
   * @param {Object} color - Color of the light in hex format.
   * @param {Object} position - Position of the light {x, y, z}.
   * @param {number} intensity - Intensity of the light.
   * @returns {THREE.PointLight} - The created point light.
   */
  CreatePointLight(color: string, position: THREE.Vector3, intensity: number): THREE.PointLight {
    const light = new THREE.PointLight(color, intensity);
    light.position.set(position.x, position.y, position.z);
    return light;
  }

  /**
   * Create a directional light with custom properties.
   * @param {Object} color - Color of the light in hex format.
   * @param {Object} position - Position of the light {x, y, z}.
   * @param {Object} target - Target position of the light {x, y, z}.
   * @param {number} intensity - Intensity of the light.
   * @returns {THREE.DirectionalLight|null} - The created directional light or null in case of error.
   */
  CreateDirectionalLight(color: number, position: position, target: position, intensity: number): THREE.DirectionalLight | null {
    try {
      if (!color || typeof color !== "number") {
        throw new Error("Invalid color parameter.");
      }

      if (!position || typeof position !== "object" || !("x" in position) || !("y" in position) || !("z" in position)) {
        throw new Error("Invalid position parameter.");
      }

      if (!target || typeof target !== "object" || !("x" in target) || !("y" in target) || !("z" in target)) {
        throw new Error("Invalid target parameter.");
      }

      if (typeof intensity !== "number") {
        throw new Error("Invalid intensity parameter.");
      }

      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(position.x, position.y, position.z);
      light.target.position.set(target.x, target.y, target.z);
      this.scene.add(light);
      return light;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating directional light:", error.message);
      }
      return null;
    }
  }

  /**
   * Create a spot light with custom properties.
   * @param {Object} color - Color of the light in hex format.
   * @param {Object} position - Position of the light {x, y, z}.
   * @param {Object} target - Target position of the light {x, y, z}.
   * @param {number} intensity - Intensity of the light.
   * @returns {THREE.SpotLight} - The created spot light.
   */
  CreateSpotLight(color: string, position: THREE.Vector3, target: THREE.Vector3, intensity: number): THREE.SpotLight {
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(position.x, position.y, position.z);
    light.target.position.set(target.x, target.y, target.z);
    this.scene.add(light.target);
    return light;
  }

  /**
   * Create a cube with custom properties.
   * @param {Object} scale - Scale of the cube in each dimension {x, y, z}.
   * @param {Object} position - Position of the cube {x, y, z}.
   * @param {Object} rotation - Rotation of the cube in radians {x, y, z}.
   * @param {string} color - Color of the cube in hex format.
   * @param {string} texturePath - Path to the texture image.
   */
  CreateCube(scale: scale = { x: 1, y: 1, z: 1 }, position: position = { x: 0, y: 0, z: 0 }, rotation: rotation = { x: 0, y: 0, z: 0 }, color: string = "#ffffff", texturePath: string | null = null): void {
    const geometry = new THREE.BoxGeometry(scale.x, scale.y, scale.z);

    // Check if texturePath is provided
    let material;
    if (texturePath) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(texturePath);

      // Use MeshStandardMaterial for realistic lighting with textures
      material = new THREE.MeshStandardMaterial({ map: texture });
    } else {
      // Use basic material with color if no texturePath is provided
      material = new THREE.MeshBasicMaterial({ color: color ? new THREE.Color(color) : 0x00ff00 });
    }

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    cube.rotation.set(rotation.x, rotation.y, rotation.z);

    this.scene.add(cube);
  }

  /**
   * Create a cube with custom properties.
   * @param {Object} scale - Scale of the sphere in each dimension {x, y, z}.
   * @param {Object} position - Position of the cube {x, y, z}.
   * @param {Object} rotation - Rotation of the cube in radians {x, y, z}.
   * @param {string} color - Color of the cube in hex format.
   * @param {string} texturePath - Path to the texture image.
   */
  CreateSphere(scale: scale = { x: 1, y: 1, z: 1 }, position: position = { x: 0, y: 0, z: 0 }, rotation: rotation = { x: 0, y: 0, z: 0 }, color: string = "#ffffff", texturePath: string | null = null): void {
    const geometry = new THREE.SphereGeometry(scale.x, scale.y, scale.z);

    // Check if texturePath is provided
    let material;
    if (texturePath) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(texturePath);

      // Use MeshStandardMaterial for realistic lighting with textures
      material = new THREE.MeshStandardMaterial({ map: texture });
    } else {
      // Use basic material with color if no texturePath is provided
      material = new THREE.MeshBasicMaterial({ color: color ? new THREE.Color(color) : 0x00ff00 });
    }

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    cube.rotation.set(rotation.x, rotation.y, rotation.z);

    this.scene.add(cube);
    console.log("cube created");
  }

  /**
   * Create a cone with custom properties.
   * @param {Object} scale - Scale of the sphere in each dimension {x, y, z}.
   * @param {Object} position - Position of the cube {x, y, z}.
   * @param {Object} rotation - Rotation of the cube in radians {x, y, z}.
   * @param {string} color - Color of the cube in hex format.
   * @param {string} texturePath - Path to the texture image.
   */
  CreateCone(scale: scale = { x: 1, y: 1, z: 1 }, position: position = { x: 0, y: 0, z: 0 }, rotation: rotation = { x: 0, y: 0, z: 0 }, color: string = "#ffffff", texturePath: string | null = null): void {
    const geometry = new THREE.ConeGeometry(scale.x, scale.y, scale.z);

    // Check if texturePath is provided
    let material;
    if (texturePath) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(texturePath);

      // Use MeshStandardMaterial for realistic lighting with textures
      material = new THREE.MeshStandardMaterial({ map: texture });
    } else {
      // Use basic material with color if no texturePath is provided
      material = new THREE.MeshBasicMaterial({ color: color ? new THREE.Color(color) : 0x00ff00 });
    }

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    cube.rotation.set(rotation.x, rotation.y, rotation.z);

    this.scene.add(cube);
  }

  /**
   * Create a cone with custom properties.
   * @param {Object} scale - Scale of the sphere in each dimension {x, y, z}.
   * @param {Object} position - Position of the cube {x, y, z}.
   * @param {Object} rotation - Rotation of the cube in radians {x, y, z}.
   * @param {string} color - Color of the cube in hex format.
   * @param {string} texturePath - Path to the texture image.
   */
  CreatePlane(scale: scale2D = { x: 1, y: 1 }, position: position = { x: 0, y: 0, z: 0 }, rotation: rotation = { x: 0, y: 0, z: 0 }, color: string | null = "#ffffff", texturePath: string | null = null): void {
    const geometry = new THREE.PlaneGeometry(scale.x, scale.y);

    // Check if texturePath is provided
    let material;
    if (texturePath) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(texturePath);

      // assuming you want the texture to repeat in both directions:
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // how many times to repeat in each direction; the default is (1,1),
      //which is probably why your example wasn't working
      texture.repeat.set(75, 75);
      console.log("loading texture");
      // Use MeshStandardMaterial for realistic lighting with textures
      material = new THREE.MeshStandardMaterial({ map: texture });
    } else {
      // Use basic material with color if no texturePath is provided
      material = new THREE.MeshBasicMaterial({ color: color ? new THREE.Color(color) : 0x00ff00 });
    }

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    cube.rotation.set(rotation.x, rotation.y, rotation.z);

    this.scene.add(cube);
  }


}
