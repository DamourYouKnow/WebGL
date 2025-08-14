// TODO: Digital and Axis input types

// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
export enum Key {
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
    Comma = "Comma",
    Period = "Period",
    Slash = "Slash",
    RightShift = "ShiftRight",
    NumpadMultiply = "NumpadMultiply",
    LeftAlt = "AltLeft",
    Space = "Space",
    CapsLock ="CapsLock",
    F1 = "F1",
    F2 = "F2",
    F3 = "F3",
    F4 = "F4",
    F5 = "F5",
    F6 = "F6",
    F7 = "F7",
    F8 = "F8",
    F9 = "F9",
    F10 = "F10",
    Pause = "Pause",
    ScrollLock = "ScrollLock",
    Numpad7 = "Numpad7",
    Numpad8 = "Numpad8",
    Numpad9 = "Numpad9",
    NumpadSubtract = "NumpadSubtract",
    Numpad4 = "Numpad4",
    Numpad5 = "Numpad5",
    Numpad6 = "Numpad6",
    NumpadAdd = "NumpadAdd",
    Numpad1 = "Numpad1",
    Numpad2 = "Numpad2",
    Numpad3 = "Numpad3",
    Numpad0 = "Numpad0",
    NumpadDecimal = "NumpadDecimal",
    F11 = "F11",
    F12 = "F12",
    NumpadEqual = "NumpadEqual",
    NumpadComma = "NumpadComma",
    MediaTrackPrevious = "MediaTrackPrevious",
    MediaTrackNext = "MediaTrackNext",
    NumpadEnter = "NumpadEnter",
    RightControl = "ControlRight",
    Mute = "AudioVolumeMute",
    MediaPlayPause = "MediaPlayPause",
    MediaStop = "MediaStop",
    NumpadDivide = "NumpadDivide",
    PrintScreen = "PrintScreen",
    RightAlt = "AltRight",
    NumLock = "NumLock",
    Home = "Home",
    ArrowUp = "ArrowUp",
    PageUp = "PageUp",
    ArrowLeft = "ArrowLeft",
    ArrowRight = "ArrowRight",
    End = "End",
    ArrowDown = "ArrowDown",
    PageDown = "PageDown",
    Insert = "Insert",
    Delete = "Delete",
    Unknown = "Unknown"
}

type Handlers = (() => void)[];

export class InputManager {
    private element: HTMLElement;
    private pressedKeys: Set<string>;

    private keyCodes: Map<string, Key>;

    private keyDownHandlers: Map<string, Handlers>
    private keyUpHandlers: Map<string, Handlers>;
    private keyHeldHandlers: Map<string, Handlers>;


    constructor(element: HTMLElement) {
        this.element = element;
        this.element.tabIndex = 1;

        this.pressedKeys = new Set<string>();

        this.keyDownHandlers = new Map<string, Handlers>();
        this.keyUpHandlers = new Map<string, Handlers>();
        this.keyHeldHandlers = new Map<string, Handlers>();

        // Setup event listeners
        this.element.addEventListener('keydown', (event) => {
            if (!this.pressedKeys.has(event.code)) {
                const handlers = this.keyDownHandlers.get(event.code);
                
                if (handlers) {
                    for (const handler of handlers) {
                        handler();
                    }
                }
            }

            this.pressedKeys.add(event.code);
        });

        this.element.addEventListener('keyup', (event) => {     
            const handlers = this.keyUpHandlers.get(event.code);
            if (handlers) {
                for (const handler of handlers) {
                    handler();
                }
            }

            this.pressedKeys.delete(event.code);
        });

        this.element.addEventListener('blur', (event) => {
            this.pressedKeys.clear();
            console.log(`Focus lost`);
        });
    }

    public KeyHeld(key: Key | string): boolean {
        throw Error("Not implemented");
    }

    public OnKeyDown(key: Key | string, handler: () => void) {
        if (!this.keyDownHandlers.has(key)) {
            this.keyDownHandlers.set(key, [])
        }

        this.keyDownHandlers.get(key).push(handler);
    }

    public OnKeyUp(key: Key | string, handler: () => void) {
        if (!this.keyUpHandlers.has(key)) {
            this.keyUpHandlers.set(key, [])
        }

        this.keyUpHandlers.get(key).push(handler);
    }

    public OnKeyHeld(key: Key | string, handler: () => void) {
        if (!this.keyHeldHandlers.has(key)) {
            this.keyHeldHandlers.set(key, [])
        }

        this.keyHeldHandlers.get(key).push(handler);
    }

    private lookupKey(keyCode: string): Key {
        const key = this.keyCodes.get(keyCode);
        return key != null ? key : Key.Unknown;
    }
}