import Phaser from 'phaser';
import playerImage from '../assets/player_sprite.png';
import playerAtlas from '../assets/player_atlas.json';
import playerAnimation from '../assets/player_anim.json';

export class MainScene extends Phaser.Scene {
  private player?: Phaser.Physics.Matter.Sprite;
  private inputKeys?: Record<string, Phaser.Input.Keyboard.Key>;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.atlas('player', playerImage, playerAtlas);
    this.load.animation('player_anim', (playerAnimation as unknown) as string);
  }

  create() {
    this.player = new Phaser.Physics.Matter.Sprite(this.matter.world, 200 , 200, 'player', 'big_demon_idle_anim_f0');
    this.add.existing(this.player);
    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>;
  }

  update() {
    const playerVelocity = new Phaser.Math.Vector2();

    if (this.inputKeys?.left.isDown) {
      playerVelocity.x = -1;
    } else if (this.inputKeys?.right.isDown) {
      playerVelocity.x = 1;
    }

    if (this.inputKeys?.up.isDown) {
      playerVelocity.y = -1;
    } else if (this.inputKeys?.down.isDown) {
      playerVelocity.y = 1;
    }

    playerVelocity.normalize();
    playerVelocity.scale(2.5);
    this.player?.setVelocity(playerVelocity.x, playerVelocity.y);
  }
}
