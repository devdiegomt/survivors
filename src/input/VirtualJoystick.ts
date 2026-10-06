import * as Phaser from 'phaser';
import type { JoystickConfig } from '../data/controls';
import type { MoveIntent } from './MoveIntent';

/**
 * Joystick táctil flotante: aparece donde el jugador apoya el dedo y desaparece al
 * soltarlo. Funciona también con ratón (arrastrando), útil para probar en escritorio.
 * Debe vivir en una escena sin scroll de cámara, porque usa coordenadas de pantalla.
 */
export class VirtualJoystick {
  private readonly base: Phaser.GameObjects.Arc;
  private readonly knob: Phaser.GameObjects.Arc;
  private pointerId: number | null = null;
  private originX = 0;
  private originY = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly output: MoveIntent,
    private readonly config: JoystickConfig,
  ) {
    this.base = scene.add
      .circle(0, 0, config.baseRadius, config.baseColor, config.baseAlpha)
      .setStrokeStyle(3, config.baseColor, config.baseAlpha * 2)
      .setVisible(false);
    this.knob = scene.add
      .circle(0, 0, config.knobRadius, config.knobColor, config.knobAlpha)
      .setVisible(false);

    const input = scene.input;
    input.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    input.on(Phaser.Input.Events.POINTER_MOVE, this.onPointerMove, this);
    input.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
    input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onPointerUp, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.pointerId !== null) {
      return; // Ya hay un dedo controlando el joystick; ignoramos los demás.
    }

    const { width, height } = this.scene.scale;
    const r = this.config.baseRadius;
    // Mantiene el aro completo dentro de la pantalla aunque se toque cerca del borde.
    this.originX = Phaser.Math.Clamp(pointer.x, r, width - r);
    this.originY = Phaser.Math.Clamp(pointer.y, r, height - r);
    this.pointerId = pointer.id;

    this.base.setPosition(this.originX, this.originY).setVisible(true);
    this.knob.setVisible(true);
    this.updateKnob(pointer);
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (pointer.id === this.pointerId) {
      this.updateKnob(pointer);
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.pointerId) {
      return;
    }
    this.pointerId = null;
    this.base.setVisible(false);
    this.knob.setVisible(false);
    this.output.reset();
  }

  private updateKnob(pointer: Phaser.Input.Pointer): void {
    const r = this.config.baseRadius;
    const dx = pointer.x - this.originX;
    const dy = pointer.y - this.originY;
    const distance = Math.hypot(dx, dy);
    const clamped = Math.min(distance, r);
    const dirX = distance > 0 ? dx / distance : 0;
    const dirY = distance > 0 ? dy / distance : 0;

    this.knob.setPosition(this.originX + dirX * clamped, this.originY + dirY * clamped);

    // Reescala la magnitud para que empiece en 0 justo al salir de la zona muerta.
    const magnitude = clamped / r;
    const deadZone = this.config.deadZone;
    if (magnitude <= deadZone) {
      this.output.reset();
      return;
    }
    const strength = (magnitude - deadZone) / (1 - deadZone);
    this.output.set(dirX * strength, dirY * strength);
  }

  destroy(): void {
    const input = this.scene.input;
    input.off(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    input.off(Phaser.Input.Events.POINTER_MOVE, this.onPointerMove, this);
    input.off(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
    input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.onPointerUp, this);
    this.output.reset();
  }
}
