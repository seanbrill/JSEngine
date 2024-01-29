//IMPORT ALL CLASSES THAT WE WILL USE AND WANT BETTER CODE COMPLETION FOR
import * as THREE from "three";
import { SceneManager } from "../../Engine/Javascript/Classes/Scene/SceneManager";
import { Scene } from "../../Engine/Javascript/Classes/Scene/Scene";
import { CameraManager } from "../../Engine/Javascript/Classes/Cameras/CameraManager";
import { MathHelpers } from "../../Engine/Javascript/Classes/Base/MathHelpers";
import { Screen } from "../../Engine/Javascript/Classes/UI/Screen";
import { InputManager } from "../../Engine/Javascript/Classes/Input/InputManager";
import { ObjectLoader } from "../../Engine/Javascript/Classes/Base/ObjectLoader";

//IMPORT STATIC ASSETS, 3D MODESL, CSS FILES, IMAGES, ETC.
//WITH OUR WEBPACK SETUP ALL ASSETS IMPORTED IN THIS FILE WILL BE INCLUDED IN THE DIST
//WITH OUR ASSETS IN THE DIST FOLDER WE CAN REFERENCE ANY ASSET AS IF THEY ARE IN THE SAME DIR
//EXAMPLE -> ./grid.png
import "./assets/favicon.ico";
import "./index.css";
import "./ui/screenOne.css";
import grid from "./assets/grid.png";
import club_music from "./assets/club.mp3";
import people from "./assets/scene.gltf";
import people_bin from "./assets/scene.bin";
import people_texture from "./assets/peopleColors_baseColor.png";
import people_texture_2 from "./assets/peopleColorsFam_baseColor.png";
import rightMouseIcon from "./assets/right-click.png";

async function Init() {
  //CREATE A SCENE MANAGER
  let sceneManager = new SceneManager();

  //DEFINE THE HTML ROOT ELEMENT
  let sceneRoot = document.querySelector("#root");

  //CREATE THE SCENE
  sceneManager.CreateScene(sceneRoot, "demo-scene", false, false, true);
  let scene = sceneManager.activeScene;

  /*Here we use this instanceof technique to give us better code completion in
  a vanilla js enviorment, ideally we would use typescript for the best development
  exerience*/

  if (scene instanceof Scene && scene.cameraManager instanceof CameraManager) {
    //ADD A UI SCREEN TO OUR SCENE
    let screenOne = new Screen("sample-ui", "screenOne.html", screenOneLoadFunction, screenOneUpdateFunction);

    //REGISTER THE SCREENS WITH THE UI MANAGER
    sceneManager.UIManager.RegisterScreens([screenOne]);

    //CREATE A FIRST PERSON CAMERA
    scene.cameraManager.CreateFirstPersonCamera("player", 75, 0.1, 1000, { x: 0, y: 8, z: 10 }, { x: 0, y: 0, z: 0 }, 5);

    //START THE SCENE
    //HERE WE PASS A SCENE UPDATE FUNCTION THAT WILL BE CALLED ONCE PER FRAME
    //WE ALSO USE THE PROMISE TO WAIT FOR THE SCENE TO START BEFORE ADDING SOME OBJECTS TO THE SCENE
    var light_color_index = 0;
    var light_colors = ["#f900ff", "#ffffff", "#1aeb00", "#ea6d00", "#380cd0"];
    var light_color = light_colors[light_color_index];
    var lastCycle = performance.now();
    var animation_mixers = [];
    let cube = null;
    let light = null;
    scene
      .Start(
        //CALLED ONCE PER FRAME WHILE SCENE IS ACTIVE
        () => {
          if (scene instanceof Scene) {
            if (cube == null) {
              cube = scene.objects.find((x) => x.name == "cube");
            }

            if (light == null) {
              light = scene.objects.find((x) => x.name == "cube-light");
            }

            if (cube && cube._object && light && light._object) {
              cube._object.position.y += 0.0125 * Math.sin(scene.frame * 0.0125);

              //PULSATE LIGHT
              light._object.intensity += 3 * Math.sin(scene.frame * 0.0125);

              //ROTATE AND MOVE LIGHT UP & DOWN
              cube._object.rotation.x += 0.005;
              cube._object.rotation.y += 0.005;
              cube._object.rotation.z += 0.005;

              //UPDATE LIGHT COLOR
              let currentTime = performance.now();
              let elapsedTime = currentTime - lastCycle;
              if (elapsedTime >= 1000) {
                if (light_color_index + 1 <= light_colors.length) light_color_index++;
                else light_color_index = 0;
                light_color = light_colors[light_color_index];
                cube._object.material.color = new THREE.Color(light_color);
                light._object.color = new THREE.Color(light_color);
                lastCycle = currentTime;
              }
            }

            //UPDATE DANCERS ANIMATION
            animation_mixers.forEach((mixer) => {
              mixer.update(scene.deltaTime);
            });
          }
        }
      )
      //CALLED ONCE AFTER SCENE START
      .then(() => {
        if (scene instanceof Scene) {
          //CREATE LOW LEVEL LIGHT FOR THE SCENE
          scene.primitiveObjects.CreateAmbientLight({ name: "scene-light", color: "#ffffff", intensity: 2 });

          let enviormentRepeat = { x: 10, y: 10 };
          //CREATE THE SKYBOX
          scene.primitiveObjects.CreateSkyBox({ name: "skybox", scale: { x: 50, y: 50, z: 50 }, color: "#303030", texturePath: "./grid.png", textureRepeat: enviormentRepeat });

          //CREATE GROUND
          scene.primitiveObjects.CreatePlane({ name: "ground", scale: { x: 50, y: 1, z: 50 }, position: { x: 0, y: 0, z: 0 }, rotation: { x: MathHelpers.DegreesToRadians(270), y: 0, z: 0 }, color: "#303030", texturePath: "./grid.png", textureRepeat: enviormentRepeat });

          //CERATE CUBE/DISCO BALL
          let cube = scene.primitiveObjects.CreateCube({ name: "cube", scale: { x: 1, y: 1, z: 1 }, position: { x: 0, y: 11, z: 5 }, rotation: { x: 0, y: 0, z: 0 }, color: light_color, texturePath: "./grid.png" }, false);
          let light = scene.primitiveObjects.CreatePointLight({ name: "cube-light", color: light_color, intensity: 20, distance: 50, decay: 1, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } });
          cube._object.add(light._object);
          cube.Instantiate();

          //LOAD PEOPLE ASSET
          new ObjectLoader(scene).LoadGLTFModel({
            name: "dance_crowd",
            modelPath: "./scene.gltf",
            scale: { x: 5, y: 5, z: 5 },
            position: { x: 0, y: 0.1, z: -5 },
            rotation: { x: 0, y: 0, z: 0 },
            onLoad: (game_object) => {
              game_object._object.animations = game_object.animations;
              game_object._object.animations.forEach((animation) => {
                //ANIMATE THE DANCERS !!
                let mixer = new THREE.AnimationMixer(game_object._object);
                const clipAction = mixer.clipAction(animation); // Assuming you want to play the first animation
                animation_mixers.push(mixer);
                clipAction.play();
              });
            },
          });

          //PLAY THE MUSIC!
          scene.audioManager.CreateAudioGroup("music");
          scene.audioManager.CreateAudioClip("music", "club_music", "./club.mp3", () => {
            if (scene instanceof Scene) {
              let audio_group = scene.audioManager.audioGroups.find((x) => x.groupName === "music");
              let audio_clip = audio_group.audioClips.find((x) => x.name == "club_music");
              if (audio_clip) {
                audio_clip.SetVolume(0.8);
              }
              //MUSIC WILL NOT PLAY UNTIL THE USER INTERACTS WITH THE DOM
              setTimeout(() => {
                scene.audioManager.PlayNextInGroup("music", true);
              }, 1000);
            }
          });
        }
      });
  }
}

//WELCOME FUNCTION FOR DEMO UI SCREEN
async function welcome() {
  let text1 = document.querySelector("#first");
  let text2 = document.querySelector("#second");
  let text3 = document.querySelector("#third");
  let text4 = document.querySelector("#fourth");

  //fade text1 in
  fadeIn(text1, 3000, 1, "flex");
  await wait(3100);
  fadeOut(text1, 3000, 1, "none");
  await wait(3100);

  //fade text2 in
  fadeIn(text2, 3000, 1, "flex");
  await wait(3100);
  fadeOut(text2, 3000, 1, "none");
  await wait(3100);

  //fade text3 & 4 in
  fadeIn(text3, 3000, 1, "flex");
  fadeIn(text4, 3000, 1, "flex");
  await wait(3100);
  fadeOut(text3, 3000, 1, "none");
  fadeOut(text4, 3000, 1, "none");
}

//HELPER FUNCTION FOR WELCOME
async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve();
    }, ms);
  });
}

//HELPER FUNCTION FADE OUT
export function fadeOut(element, timeMs, opacityLevel, callback) {
  if (!element) return;
  element.animate([{ opacity: opacityLevel ? opacityLevel : 1 }, { opacity: 0 }], { duration: timeMs });
  setTimeout(() => {
    element.style.display = "none";
    if (callback) callback();
  }, timeMs - 100);
}

//HELPER FUNCTION FADE IN
export function fadeIn(element, timeMs, opacityLevel, displayType, callback) {
  if (!element) return;
  element.style.display = displayType ? displayType : "flex";
  element.animate([{ opacity: 0 }, { opacity: opacityLevel ? opacityLevel : 1 }], { duration: timeMs });
  setTimeout(() => {
    element.style.opacity = opacityLevel ? opacityLevel.toString() : "1";
    if (callback) callback();
  }, timeMs - 100);
}

//ON LOAD FUNCTION FOR OUR DEMO UI SCREEN
function screenOneLoadFunction() {
  let mouseImg = document.querySelector("#right-mouse");
  if (mouseImg) mouseImg.src = rightMouseIcon;
  welcome();
}

//UPDATE FUCNTION FOR OUR DEMO UI SCREEN, CALLED ONCE PER FRAME
function screenOneUpdateFunction() {
  let keys = InputManager.GetActiveKeys();
  let w = document.querySelector("#w");
  let a = document.querySelector("#a");
  let s = document.querySelector("#s");
  let d = document.querySelector("#d");

  let normalBoxShadow = "0px 4px 0px 3px rgb(177, 176, 176)";
  let pressBoxShadow = "0px 4px 0px 4px rgb(156, 154, 154)";

  if (w) {
    if (keys.has("KeyW")) w.style.boxShadow = pressBoxShadow;
    else w.style.boxShadow = normalBoxShadow;
  }

  if (a) {
    if (keys.has("KeyA")) a.style.boxShadow = pressBoxShadow;
    else a.style.boxShadow = normalBoxShadow;
  }

  if (s) {
    if (keys.has("KeyS")) s.style.boxShadow = pressBoxShadow;
    else s.style.boxShadow = normalBoxShadow;
  }

  if (d) {
    if (keys.has("KeyD")) d.style.boxShadow = pressBoxShadow;
    else d.style.boxShadow = normalBoxShadow;
  }
}

//INITIALIZE THE SCENE
Init();
