//Import all JSEngine Classes and dependencies to generate
//the minified output when running webpack
import * as THREE from "three";

import { PhysicsEngine } from "./Engine/Javascript/Classes/Base/Physics/Physics";
import { GameObject } from "./Engine/Javascript/Classes/Base/GameObject";
import { MathHelpers } from "./Engine/Javascript/Classes/Base/MathHelpers";
import { ObjectLoader } from "./Engine/Javascript/Classes/Base/ObjectLoader";
import { Primitives } from "./Engine/Javascript/Classes/Base/PrimitiveHelpers";

import { Camera } from "./Engine/Javascript/Classes/Cameras/Camera";
import { FirstPersonCamera } from "./Engine/Javascript/Classes/Cameras/FirstPersonCamera";
import { CameraManager } from "./Engine/Javascript/Classes/Cameras/CameraManager";

import { InputManager } from "./Engine/Javascript/Classes/Input/InputManager";

import { Scene } from "./Engine/Javascript/Classes/Scene/Scene";
import { SceneManager } from "./Engine/Javascript/Classes/Scene/SceneManager";

import { Screen } from "./Engine/Javascript/Classes/UI/Screen";
import { UIManager } from "./Engine/Javascript/Classes/UI/UIManager";

//expose these classes to the browser window
//this is the best current solution I have come up with to expose the classes when importing the minified js
window.THREE = THREE;
window.PhysicsEngine = PhysicsEngine;
window.GameObject = GameObject;
window.MathHelpers = MathHelpers;
window.ObjectLoader = ObjectLoader;
window.Primitives = Primitives;
window.Camera = Camera;
window.FirstPersonCamera = FirstPersonCamera;
window.CameraManager = CameraManager;
window.InputManager = InputManager;
window.InputManager.instance = new InputManager();
window.Scene = Scene;
window.SceneManager = SceneManager;
window.Screen = Screen;
window.UIManager = UIManager;
