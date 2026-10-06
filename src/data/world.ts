/** Tamaño y aspecto del mundo jugable (más grande que la pantalla). */
export interface WorldConfig {
  readonly width: number;
  readonly height: number;
  /** Lado de cada celda de la cuadrícula de fondo, en píxeles. */
  readonly gridCellSize: number;
  readonly groundColor: number;
  readonly gridLineColor: number;
  readonly gridLineAlpha: number;
  readonly borderColor: number;
  readonly borderWidth: number;
}

export const WORLD: WorldConfig = {
  width: 4000,
  height: 4000,
  gridCellSize: 128,
  groundColor: 0x161a22,
  gridLineColor: 0x2a3140,
  gridLineAlpha: 1,
  borderColor: 0xd94a4a,
  borderWidth: 8,
};
