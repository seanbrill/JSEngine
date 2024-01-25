export interface InputHandler {
  id: number;
  function: () => any;
  type: string;
}

export class InputManager {
  static instance: InputManager;
  static mouseX: number = 0;
  static mouseY: number = 0;
  static prevMouseX: number = 0;
  static prevMouseY: number = 0;
  //array of previous inputs
  static previous_inputs: string[] = [];
  //array of keys being pressed
  static Keys: Set<string> = new Set();
  //event listeners
  static handlers: InputHandler[] = [];


  constructor() {
    InputManager.instance = this;
    //Track Key presses
    window.addEventListener("keydown", (e) => {
      let key = e.code;
      InputManager.Keys.add(key);
      //record the users input
      InputManager.previous_inputs.push(key);
      InputManager.RunHandlers("keydown");
    });

    //Track Keyups
    window.addEventListener("keyup", (e) => {
      InputManager.Keys.delete(e.code);
      InputManager.RunHandlers("keyup");
    });

    //Track Mouse Movements
    window.addEventListener("mousemove", (e) => {
      InputManager.prevMouseX = InputManager.mouseX;
      InputManager.prevMouseY = InputManager.mouseY;
      InputManager.mouseX = e.pageX - window.innerWidth / 2;
      InputManager.mouseY = e.pageY - window.innerHeight / 2;
      InputManager.RunHandlers("mousemove");
    });

    //Track Mouse Buttons
    window.addEventListener("mousedown", (e) => {
      console.log("mouse button : ", e.button);
      switch (e.button) {
        case 1:
          //record the users input
          InputManager.previous_inputs.push("Mouse1");
          InputManager.Keys.add("Mouse1");
        case 2:
          //record the users input
          InputManager.previous_inputs.push("Mouse2");
          InputManager.Keys.add("Mouse2");
        default:
          //record the users input
          InputManager.previous_inputs.push("_Mouse1");
          InputManager.Keys.add("_Mouse1");
      }
      InputManager.RunHandlers("mousedown");
    });

    //Track Mouseups
    window.addEventListener("mouseup", (e) => {
      switch (e.button) {
        case 1:
          InputManager.Keys.delete("Mouse1");
        case 2:
          InputManager.Keys.delete("Mouse2");
        default:
          InputManager.Keys.delete("_Mouse1");
      }
      InputManager.RunHandlers("mouseup");
    });
  }

  static GetMousePosition() {
    return { x: InputManager.mouseX, y: InputManager.mouseY };
  }

  static GetMouseDirection() {
    let x = InputManager.mouseX - InputManager.prevMouseX;
    let y = InputManager.mouseY - InputManager.prevMouseY;
    let magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return { x, y, magnitude };
  }

  static GetActiveKeys() {
    return InputManager.Keys;
  }

  static GetInputHistory() {
    return InputManager.previous_inputs;
  }

  static RunHandlers(event_type: string) {
    for (const handler of InputManager.handlers) {
      if (handler.type === event_type) handler.function();
    }
  }

  static RegisterHandler(event_type: string, event_handler: () => any) {
    if (!event_type) throw new Error("register event handler requires an event type");
    let id = this.handlers.length + 1;
    let _handler: InputHandler = { id, function: event_handler, type: event_type };
    InputManager.handlers.push(_handler);
    return _handler;
  }
}
