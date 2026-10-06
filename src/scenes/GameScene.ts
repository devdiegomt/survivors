import * as Phaser from 'phaser';
import { CAMERA } from '../data/camera';
import { CONTROLS } from '../data/controls';
import { PLAYER } from '../data/player';
import { WORLD } from '../data/world';
import { Player } from '../entities/Player';
import { KeyboardMove } from '../input/KeyboardMove';
import { MoveIntent } from '../input/MoveIntent';
import { SceneKeys } from './keys';
import type { UISceneData } from './UIScene';

const GROUND_TEXTURE = 'ground-tile';

/** Escena del mundo: suelo, jugador, física y cámara que lo sigue. */
export class GameScene extends Phaser.Scene {
  private player!: Player;
  private keyboard!: KeyboardMove;
  /** Lo escribe el joystick de la UIScene; aquí solo se lee. */
  private readonly joystickIntent = new MoveIntent();
  /** Intención final que se aplica al jugador en cada frame. */
  private readonly moveIntent = new MoveIntent();

  constructor() {
    super(SceneKeys.Game);
  }

  create(): void {
    this.physics.world.setBounds(0, 0, WORLD.width, WORLD.height);
    this.createGround();

    this.player = new Player(this, WORLD.width / 2, WORLD.height / 2, PLAYER);
    this.keyboard = new KeyboardMove(this, CONTROLS.keys);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, WORLD.width, WORLD.height);
    camera.startFollow(this.player, false, CAMERA.followLerp, CAMERA.followLerp);

    const uiData: UISceneData = { moveIntent: this.joystickIntent };
    this.scene.launch(SceneKeys.UI, uiData);
  }

  override update(): void {
    // El teclado tiene prioridad; si no se pulsa nada, manda el joystick.
    if (!this.keyboard.read(this.moveIntent)) {
      this.moveIntent.copy(this.joystickIntent);
    }
    this.player.move(this.moveIntent);
  }

  /** Suelo en cuadrícula (una baldosa repetida) y borde visible del mundo. */
  private createGround(): void {
    const cell = WORLD.gridCellSize;

    if (!this.textures.exists(GROUND_TEXTURE)) {
      const g = this.make.graphics({}, false);
      g.fillStyle(WORLD.groundColor, 1);
      g.fillRect(0, 0, cell, cell);
      g.fillStyle(WORLD.gridLineColor, WORLD.gridLineAlpha);
      g.fillRect(0, 0, cell, 2);
      g.fillRect(0, 0, 2, cell);
      g.generateTexture(GROUND_TEXTURE, cell, cell);
      g.destroy();
    }

    this.add.tileSprite(0, 0, WORLD.width, WORLD.height, GROUND_TEXTURE).setOrigin(0, 0);
    this.add
      .rectangle(WORLD.width / 2, WORLD.height / 2, WORLD.width, WORLD.height)
      .setStrokeStyle(WORLD.borderWidth, WORLD.borderColor, 1);
  }
}
