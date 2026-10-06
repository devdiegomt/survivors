/** Comportamiento de la cámara que sigue al jugador. */
export interface CameraConfig {
  /** Suavizado del seguimiento (0..1). 1 = pegada al jugador, menor = más suave. */
  readonly followLerp: number;
}

export const CAMERA: CameraConfig = {
  followLerp: 0.12,
};
