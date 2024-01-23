import * as THREE from "three";
import { GameObject } from "../GameObject";


export interface PhysicsOptions {
  enabled: boolean;
  mass: number;
  useGravity: boolean;
  collisionEnabled: boolean;
}

export const defaultPhysicsOptions: PhysicsOptions = {
  enabled: true,
  mass: 1,
  useGravity: true,
  collisionEnabled: true,
};

export class PhysicsEngine {
  //static fields
  static gravity: number = 9.8;
  static Xaxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
  static Yaxis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  static Zaxis: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
  //class members
  classObject: GameObject;
  _object: THREE.Object3D | undefined;
  options: PhysicsOptions;
  velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  acceleration: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  momentum: number = 0;
  collisions = [{ object: {}, direction: { x: 0, y: 0, z: 0 } }];

  constructor(classObject: GameObject, physicsOptions = defaultPhysicsOptions) {
    this.classObject = classObject;
    this.options = physicsOptions;
  }

  CheckForCollisions() {
    if (!this.options.collisionEnabled || !this._object) return;
    this.collisions = [];

    // Create a helper object attached to the camera
    const helperObject = new THREE.Object3D();
    helperObject.position.copy(this._object.position);
    this._object.add(helperObject);

    //console.log("camera with object:", this._object);

    const box1 = new THREE.Box3().setFromObject(helperObject, true);
    const position1 = helperObject.position.clone();

    this.classObject.scene.traverse((object) => {
      if (object !== helperObject) {
        const box2 = new THREE.Box3().setFromObject(object, true);
        const position2 = object.position.clone();
        if (box1.intersectsBox(box2)) {
          // Collision detected
          const direction = new THREE.Vector3().subVectors(position2, position1).normalize();
          this.collisions.push({ object, direction });
          console.log("Collision with", object);
          console.log("Collision direction:", direction);
        }
      }
    });

    // Remove the helper object from the camera
    this._object.remove(helperObject);
  }

  async Gravity() {
    if (!this.collisions.find((x) => x.direction.y == -1)) {
      let down = new THREE.Vector3(...PhysicsEngine.Yaxis);
      this.acceleration.y -= PhysicsEngine.gravity;
      let vector = down.multiplyScalar(this.acceleration.y);
      let finalVector = new THREE.Vector3(...this.classObject.translation).add(vector);
      //this.classObject.translation.add(vector);
      //this._object.position.lerp(this.classObject.translation, 0.15);
    }
  }

  CalcForce(mass: number, acceleration: number) {
    return mass * acceleration;
  }
}
