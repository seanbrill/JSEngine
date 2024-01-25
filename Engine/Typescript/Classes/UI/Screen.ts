import { UIManager } from "./UIManager";

export class Screen {
  name: string;
  html: string | null = null;
  node: HTMLElement | undefined;
  updateFunction: (() => any) | undefined;
  onLoadFunction: (() => any) | undefined;

  constructor(name: string, htmlPath: string, onLoadFunction?: () => any, updateFunction?: () => any) {
    this.name = name;
    // Fetch the HTML file
    fetch(htmlPath)
      .then(response => response.text())
      .then(htmlString => {
        this.html = htmlString;
        if (UIManager.activeScreen == this) this.Initialize(UIManager.root);
      })
    if (onLoadFunction) this.onLoadFunction = onLoadFunction;
    if (updateFunction) this.updateFunction = updateFunction;
  }

  Update() {
    if (this.updateFunction) {
      this.updateFunction();
    }
  }

  Initialize(scene_node: HTMLElement) {
    if (this.html) {
      let el = document.createElement("div");
      el.id = "ui-screen-" + this.name;
      el.innerHTML = this.html;
      this.node = el;
      if (scene_node instanceof HTMLElement) scene_node.appendChild(this.node);
      if (this.onLoadFunction) this.onLoadFunction();
    }
  }

  Destroy() {
    if (this.node) {
      UIManager.root.removeChild(this.node);
    }
  }
}
