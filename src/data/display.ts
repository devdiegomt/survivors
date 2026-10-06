/**
 * Resolución lógica del juego (9:16 vertical). El ScaleManager la escala con FIT
 * a cualquier pantalla, así que toda la lógica trabaja siempre en estas unidades.
 */
export interface DisplayConfig {
  readonly width: number;
  readonly height: number;
  readonly backgroundColor: string;
}

export const DISPLAY: DisplayConfig = {
  width: 720,
  height: 1280,
  backgroundColor: '#0b0d12',
};
