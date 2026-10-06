/** Estadísticas y aspecto base del personaje. */
export interface PlayerConfig {
  /** Lado del cuadrado, en píxeles. */
  readonly size: number;
  readonly color: number;
  /** Velocidad máxima en píxeles por segundo. */
  readonly speed: number;
}

export const PLAYER: PlayerConfig = {
  size: 48,
  color: 0x4fc3f7,
  speed: 320,
};
