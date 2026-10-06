import * as Phaser from 'phaser';
import type { KeyBindings } from '../data/controls';
import type { MoveIntent } from './MoveIntent';

interface DirectionKeys {
  readonly up: Phaser.Input.Keyboard.Key;
  readonly down: Phaser.Input.Keyboard.Key;
  readonly left: Phaser.Input.Keyboard.Key;
  readonly right: Phaser.Input.Keyboard.Key;
}

/** Traduce las teclas de dirección configuradas a un MoveIntent normalizado. */
export class KeyboardMove {
  private readonly keys: DirectionKeys | null;

  constructor(scene: Phaser.Scene, bindings: KeyBindings) {
    const keyboard = scene.input.keyboard;
    // En dispositivos sin teclado (o si se desactiva en la config) el plugin es null.
    this.keys = keyboard
      ? {
          up: keyboard.addKey(bindings.up),
          down: keyboard.addKey(bindings.down),
          left: keyboard.addKey(bindings.left),
          right: keyboard.addKey(bindings.right),
        }
      : null;
  }

  /** Escribe la dirección en `out`. Devuelve true si hay alguna tecla pulsada. */
  read(out: MoveIntent): boolean {
    if (!this.keys) {
      return false;
    }

    const x = Number(this.keys.right.isDown) - Number(this.keys.left.isDown);
    const y = Number(this.keys.down.isDown) - Number(this.keys.up.isDown);

    if (x === 0 && y === 0) {
      return false;
    }

    // Normaliza para que la diagonal no sea más rápida que los ejes.
    const length = Math.hypot(x, y);
    out.set(x / length, y / length);
    return true;
  }
}
