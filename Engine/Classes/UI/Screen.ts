import { UIManager } from "./UIManager";

export class Screen {
  name: string;
  html: string;
  css: string;
  node: HTMLElement | undefined;

  constructor(name: string, html: string, css: string) {
    this.name = name;
    this.html = html;
    this.css = css;
  }

  Initialize(scene_node: HTMLElement) {
    let el = document.createElement("div");
    el.id = "ui-screen-" + this.name;
    el.innerHTML = this.html;
    this.node = el;
    if (scene_node instanceof HTMLElement) scene_node.appendChild(this.node);
  }

  Destroy() {
    if (this.node) {
      UIManager.root.removeChild(this.node);
    }
  }
}
