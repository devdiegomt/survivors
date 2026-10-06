/** Ajustes de los controles: joystick táctil y teclado. */
export interface JoystickConfig {
  /** Radio del aro exterior; el pulgar no se aleja más que esto del origen. */
  readonly baseRadius: number;
  readonly knobRadius: number;
  /** Fracción del radio (0..1) por debajo de la cual se ignora el movimiento. */
  readonly deadZone: number;
  readonly baseColor: number;
  readonly baseAlpha: number;
  readonly knobColor: number;
  readonly knobAlpha: number;
}

export interface KeyBindings {
  readonly up: string;
  readonly down: string;
  readonly left: string;
  readonly right: string;
}

export interface ControlsConfig {
  readonly joystick: JoystickConfig;
  readonly keys: KeyBindings;
}

export const CONTROLS: ControlsConfig = {
  joystick: {
    baseRadius: 110,
    knobRadius: 46,
    deadZone: 0.12,
    baseColor: 0xffffff,
    baseAlpha: 0.15,
    knobColor: 0xffffff,
    knobAlpha: 0.45,
  },
  keys: {
    up: 'W',
    down: 'S',
    left: 'A',
    right: 'D',
  },
};
