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
exports.MathHelpers = void 0;
const THREE = __importStar(require("three"));
class MathHelpers {
    /**
     * Converts a degree input to radians
     * @param {number} deg  - degrees
     * @returns {number}  the degrees as radians
     */
    static DegreesToRadians(deg) {
        return (deg * Math.PI) / 180;
    }
    /**
     * Gets the forward vetor for the specifed phi and magnitude,
     * useful for finding an Objects locl z reguardless of its rotation
     * @param {number} phi  - desc
     * @param {number} magnitude  - desc
     * @returns {THREE.Vector3}  desc
     */
    static GetForwardVector(phi, magnitude = 1) {
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
    static GetLeftVector(phi, magnitude = 1) {
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
exports.MathHelpers = MathHelpers;
