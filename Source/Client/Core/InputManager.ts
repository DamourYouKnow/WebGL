// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
enum Key {
    Escape = "Escape",
    Number1 = "Digit1",
    Number2 = "Digit2",
    Number3 = "Digit3",
    Number4 = "Digit4",
    Number5 = "Digit5",
    Number6 = "Digit6",
    Number7 = "Digit7",
    Number8 = "Digit8",
    Number9 = "Digit9",
    Number0 = "Digit0",
    Minus = "Minus",
    Equal = "Equal",
    Backspace = "Backspace",
    Tab = "Tab",
    Q = "KeyQ",
    W = "KeyW",
    E = "KeyE",
    R = "KeyR",
    T = "KeyT",
    Y = "KeyY",
    U = "KeyU",
    I = "KeyI",
    O = "KeyO",
    P = "KeyP",
    LeftBracket = "BracketLeft",
    RightBracket = "BracketRight",
    Enter = "Enter",
    LeftControl = "ControlLeft",
    A = "KeyA",
    S = "KeyS",
    D = "KeyD",
    F = "KeyF",
    G = "KeyG",
    H = "KeyH",
    J = "KeyJ",
    K = "KeyK",
    L = "KeyL",
    SemiColon = "Semicolon",
    Quote = "Quote",
    Backquote = "Backquote",
    LeftShift = "ShiftLeft",
    Backslash = "Backslash",
    Z = "KeyZ",
    X = "KeyX",
    C = "KeyC",
    V = "KeyV",
    B = "KeyB",
    N = "KeyN",
    M = "KeyM",
    // TODO: Complete the enum
}


export class InputManager {
    private element: HTMLElement;
    private pressedKeys: Set<string>


    constructor(element: HTMLElement) {
        this.element = element;
        this.element.tabIndex = 1;
        this.pressedKeys = new Set<string>();

        this.element.addEventListener('keydown', (event) => {
            this.pressedKeys.add(event.code);
            console.log(`Keydown: ${event.code}`);
        });

        this.element.addEventListener('keyup', (event) => {
            this.pressedKeys.delete(event.code);
            console.log(`Keyup: ${event.code}`);
        });

        this.element.addEventListener('blur', (event) => {
            this.pressedKeys.clear();
            console.log(`Focus lost`);
        });
    }

    public KeyHeld(): boolean {
        throw Error("Not implemented");
    }
}