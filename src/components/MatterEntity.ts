import Phaser from 'phaser';
import { Drop } from './Drop';

type TMatterEntity = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  frame?: string | number;
  depth?: number;
  health: number;
  soundKey?: string;
  drops: number[];
}

export class MatterEntity extends Phaser.Physics.Matter.Sprite {
  private readonly _position: Phaser.Math.Vector2;
  private readonly drops: number[];
  private readonly sound?: Phaser.Sound.BaseSound;
  private health: number;

  constructor({ scene, x, y, texture, frame, drops, health, soundKey, depth }: TMatterEntity) {
    super(scene.matter.world, x, y, texture, frame);

    this.x += this.width / 2;
    this.y -= this.height / 2;
    this.drops = drops;
    this.health = health;
    this.depth = depth || 1;
    this._position = new Phaser.Math.Vector2(this.x, this.y);
    if (soundKey) {
      this.sound = this.scene.sound.add(soundKey);
    }
    this.scene.add.existing(this);
  }

  public get position() {
    this._position.set(this.x, this.y);
    return this._position;
  }

  public get velocity() {
    return this.body.velocity;
  }

  public get dead() {
    return this.health <= 0;
  }

  public onDeath = () => {};

  public hit() {
    this.health--;
    if (this.sound) this.sound.play();

    if (this.dead && this.drops) {
      for (const drop of this.drops) {
        new Drop(this.scene, this.x, this.y, drop);
      }
      this.destroy();
    }
  }
}