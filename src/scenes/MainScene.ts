import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  private monster?: Phaser.Physics.Matter.Sprite;
  private inputKeys?: Record<string, Phaser.Input.Keyboard.Key>;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.atlas('monster', '/assets/monster_sprite.png', '/assets/monster_atlas.json');
    this.load.animation('monster_anim', '/assets/monster_anim.json');
  }

  create() {
    this.monster = new Phaser.Physics.Matter.Sprite(this.matter.world, 200 , 200, 'monster', 'big_demon_idle_anim_f0');
    this.add.existing(this.monster);
    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>;
  }

  update() {
    this.monster?.anims.play('monster_walk', true);
    const monsterVelocity = new Phaser.Math.Vector2();

    if (this.inputKeys?.left.isDown) {
      monsterVelocity.x = -1;
    } else if (this.inputKeys?.right.isDown) {
      monsterVelocity.x = 1;
    }

    if (this.inputKeys?.up.isDown) {
      monsterVelocity.y = -1;
    } else if (this.inputKeys?.down.isDown) {
      monsterVelocity.y = 1;
    }

    monsterVelocity.normalize();
    monsterVelocity.scale(2.5);
    this.monster?.setVelocity(monsterVelocity.x, monsterVelocity.y);
  }
}
