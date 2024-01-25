"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Screen = void 0;
const UIManager_1 = require("./UIManager");
class Screen {
    constructor(name, htmlPath, onLoadFunction, updateFunction) {
        this.html = null;
        this.name = name;
        // Fetch the HTML file
        fetch(htmlPath)
            .then(response => response.text())
            .then(htmlString => {
            this.html = htmlString;
            if (UIManager_1.UIManager.activeScreen == this)
                this.Initialize(UIManager_1.UIManager.root);
        });
        if (onLoadFunction)
            this.onLoadFunction = onLoadFunction;
        if (updateFunction)
            this.updateFunction = updateFunction;
    }
    Update() {
        if (this.updateFunction) {
            this.updateFunction();
        }
    }
    Initialize(scene_node) {
        if (this.html) {
            let el = document.createElement("div");
            el.id = "ui-screen-" + this.name;
            el.innerHTML = this.html;
            this.node = el;
            if (scene_node instanceof HTMLElement)
                scene_node.appendChild(this.node);
            if (this.onLoadFunction)
                this.onLoadFunction();
        }
    }
    Destroy() {
        if (this.node) {
            UIManager_1.UIManager.root.removeChild(this.node);
        }
    }
}
exports.Screen = Screen;
