import React, { useEffect, useRef, useState } from "react";
import "./Scenes.css";
import { SceneManager } from "../ThreeJs/SceneManager";
import { Primitives } from "../ThreeJs/PrimitiveHelpers";
import { MathHelpers } from "../ThreeJs/MathHelpers";
import { Screen } from "../UI/Screen";

import DemoScreen from "../UI/screens/demo-screen";
import { UIManager } from "../UI/UIManager";

function Scene(props) {
  const _sceneManager = useRef();

  useEffect(() => {
    if (!props.id) {
      console.error("Props must contain id");
      return;
    }
    setTimeout(() => {
      Init();
    }, 500);
  }, []);

  async function Init() {
    // Initialize SceneManager
    if (!_sceneManager.current) {
      _sceneManager.current = new SceneManager();
    }

    let sceneManager = _sceneManager.current;
    let sceneRoot = document.querySelector(`#${props.id}`);
    sceneManager.CreateScene(sceneRoot, props.id, false, true, true);

    // Initialize In-Game UI
    let screens = [];
    let screen1 = new Screen("controls01", UIManager.ConvertToHtml(<DemoScreen />), null);
    screens.push(screen1);
    sceneManager.UIManager.RegisterScreens(screens);

    let scene = sceneManager.activeScene;
    if (!scene) return;
    let p = new Primitives(scene.scene);

    //create a first person camera
    scene.cameraManager.CreateFirstPersonCamera(scene.scene, "player", 75, 0.1, 1000, { x: 0, y: 2.5, z: 5 }, { x: 0, y: 0, z: 0 }, 5);
    scene.Start().then(() => {
      scene.SetSkyBox(["./skybox.png"]);

      //create floor
      p.CreatePlane({ x: 1000, y: 1000, z: 0 }, { x: 0, y: 0.5, z: 0 }, { x: MathHelpers.DegreesToRadians(270), y: 0, z: 0 }, null, "./moon.png");

      //create cubes
      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, "#29e2a3");
      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 0, y: 2, z: 0 }, { x: 0, y: 0, z: 0 }, "#e20000");
      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 0, y: 3, z: 0 }, { x: 0, y: 0, z: 0 }, "#0642f3");
      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 0, y: 4, z: 0 }, { x: 0, y: 0, z: 0 }, "#dc15cc");

      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: -2, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, "#29e2a3");
      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: -2, y: 2, z: 0 }, { x: 0, y: 0, z: 0 }, "#e20000");
      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: -2, y: 3, z: 0 }, { x: 0, y: 0, z: 0 }, "#0642f3");
      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: -2, y: 4, z: 0 }, { x: 0, y: 0, z: 0 }, "#dc15cc");

      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 2, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, "#29e2a3");
      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 0 }, { x: 0, y: 0, z: 0 }, "#e20000");
      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 2, y: 3, z: 0 }, { x: 0, y: 0, z: 0 }, "#0642f3");
      // p.CreateCube({ x: 1, y: 1, z: 1 }, { x: 2, y: 4, z: 0 }, { x: 0, y: 0, z: 0 }, "#dc15cc");

      //load rover
      let rover_scale = 0.05;
      p.LoadGLTFModel("./rover.glb", { x: rover_scale, y: rover_scale, z: rover_scale }, { x: 0, y: 0.4, z: -5 }, { x: 0, y: MathHelpers.DegreesToRadians(145), z: 0 });
    });
  }

  return <div id={props.id} className={props.class}></div>;
}

export default Scene;
