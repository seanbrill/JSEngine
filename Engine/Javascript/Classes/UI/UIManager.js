"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIManager = void 0;
const Screen_1 = require("./Screen");
class UIManager {
    constructor(screens) {
        let id = "ui-manager-root";
        let root = document.createElement("div");
        root.id = id;
        console.log("appending root");
        document.body.appendChild(root);
        UIManager.root = root;
        UIManager.root.style.position = "absolute";
        UIManager.root.style.height = "100%";
        UIManager.root.style.width = "100%";
        UIManager.root.style.cursor = "crosshair";
        if (screens) {
            UIManager.screens = screens;
        }
    }
    static Update() {
        UIManager.activeScreen.Update();
    }
    RegisterScreens(screens, startingIndex = 0) {
        this.DestroyActiveScreen();
        UIManager.screens = screens;
        UIManager.screenIndex = startingIndex;
        UIManager.activeScreen = UIManager.screens[UIManager.screenIndex];
        this.UpdateActiveScreen();
    }
    DestroyActiveScreen() {
        if (UIManager.activeScreen instanceof Screen_1.Screen && UIManager.activeScreen.name != null) {
            UIManager.activeScreen.Destroy();
        }
    }
    UpdateActiveScreen() {
        if (UIManager.activeScreen instanceof Screen_1.Screen) {
            UIManager.activeScreen.Initialize(UIManager.root);
        }
    }
    NextScreen() {
        if (UIManager.screenIndex + 1 < UIManager.screens.length) {
            UIManager.screenIndex++;
            this.DestroyActiveScreen();
            UIManager.activeScreen = UIManager.screens[UIManager.screenIndex];
            this.UpdateActiveScreen();
        }
    }
    PreviousScreen() {
        if (UIManager.screenIndex - 1 >= 0) {
            UIManager.screenIndex--;
            this.DestroyActiveScreen();
            UIManager.activeScreen = UIManager.screens[UIManager.screenIndex];
            this.UpdateActiveScreen();
        }
    }
    AdvanceToScreen(screenName) {
        let screen = UIManager.screens.find((x) => x.name == screenName);
        if (screen) {
            UIManager.screenIndex = UIManager.screens.indexOf(screen);
            this.DestroyActiveScreen();
            UIManager.activeScreen = screen;
            this.UpdateActiveScreen();
        }
    }
}
exports.UIManager = UIManager;
UIManager.screenIndex = 0;
