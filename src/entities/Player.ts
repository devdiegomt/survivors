import * as Phaser from 'phaser';
import type { PlayerConfig } from '../data/player';
import type { MoveIntent } from '../input/MoveIntent';

/** El personaje: de momento un cuadrado con cuerpo de Arcade Physics. */
export class Player extends Phaser.GameObjects.Rectangle {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private readonly stats: PlayerConfig,
  ) {
    super(scene, x, y, stats.size, stats.size, stats.color);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
  }

  move(intent: MoveIntent): void {
    this.body.setVelocity(intent.x * this.stats.speed, intent.y * this.stats.speed);
  }
}
