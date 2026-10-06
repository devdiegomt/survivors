import * as Phaser from 'phaser';
import { DISPLAY } from './data/display';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'Survivors',
  backgroundColor: DISPLAY.backgroundColor,
  disableContextMenu: true,
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DISPLAY.width,
    height: DISPLAY.height,
  },
  input: {
    activePointers: 3,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      // Paso sincronizado con el refresco de pantalla: movimiento fluido en
      // móviles de 90/120 Hz sin tirones en el seguimiento de la cámara.
      fixedStep: false,
      debug: false,
    },
  },
  scene: [GameScene, UIScene],
};

new Phaser.Game(config);
