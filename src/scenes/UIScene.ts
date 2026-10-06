import * as Phaser from 'phaser';
import { CONTROLS } from '../data/controls';
import type { MoveIntent } from '../input/MoveIntent';
import { VirtualJoystick } from '../input/VirtualJoystick';
import { SceneKeys } from './keys';

export interface UISceneData {
  /** Objeto compartido donde el joystick escribe la dirección. */
  readonly moveIntent: MoveIntent;
}

/**
 * Capa de interfaz que se dibuja encima del mundo con su propia cámara fija,
 * así el joystick (y el futuro HUD) no se ven afectados por el scroll ni el zoom.
 */
export class UIScene extends Phaser.Scene {
  private moveIntent!: MoveIntent;

  constructor() {
    super(SceneKeys.UI);
  }

  init(data: UISceneData): void {
    this.moveIntent = data.moveIntent;
  }

  create(): void {
    new VirtualJoystick(this, this.moveIntent, CONTROLS.joystick);
  }
}
