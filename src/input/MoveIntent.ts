/**
 * Dirección de movimiento deseada, con magnitud entre 0 y 1.
 * Es el contrato común entre las fuentes de input (teclado, joystick) y el jugador,
 * de modo que el jugador no sabe ni le importa de dónde viene la orden.
 */
export class MoveIntent {
  x = 0;
  y = 0;

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(other: MoveIntent): this {
    return this.set(other.x, other.y);
  }

  reset(): this {
    return this.set(0, 0);
  }

  isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }
}
