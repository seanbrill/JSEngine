import * as THREE from "three";

export class MathHelpers {

  /**
   * Converts a degree input to radians
   * @param {number} deg  - degrees
   * @returns {number}  the degrees as radians
   */
  static DegreesToRadians(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  /**
   * Gets the forward vetor for the specifed phi and magnitude,
   * useful for finding an Objects locl z reguardless of its rotation
   * @param {number} phi  - desc
   * @param {number} magnitude  - desc
   * @returns {THREE.Vector3}  desc
   */
  static GetForwardVector(phi: number, magnitude: number = 1): THREE.Vector3 {
    const qx = new THREE.Quaternion();
    //get the axis angle
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), phi);
    //world space forward
    const forward = new THREE.Vector3(0, 0, -1);
    //apply the axis angle on the forward vector to get relative positive z direction
    forward.applyQuaternion(qx);
    //multiply the vecory by the magnitude
    forward.multiplyScalar(magnitude);
    return forward;
  }

  /**
   * Gets the forward vetor for the specifed phi and magnitude,
   * useful for finding an Objects locl z reguardless of its rotation
   * @param {number} phi  - desc
   * @param {number} magnitude  - desc
   * @returns {THREE.Vector3}  desc
   */
  static GetLeftVector(phi: number, magnitude: number = 1): THREE.Vector3 {
    const qx = new THREE.Quaternion();
    //get the axis angle
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), phi);
    //world space forward
    const forward = new THREE.Vector3(-1, 0, 0);
    //apply the axis angle on the forward vector to get relative positive z direction
    forward.applyQuaternion(qx);
    //multiply the vecory by the magnitude
    forward.multiplyScalar(magnitude);
    return forward;
  }
}
