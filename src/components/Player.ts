import Phaser from 'phaser';

import { Resource } from './Resource';

export class Player extends Phaser.Physics.Matter.Sprite {
  private readonly weapon: Phaser.GameObjects.Sprite;
  private weaponRotation = 0;
  private inputKeys: Record<string, Phaser.Input.Keyboard.Key>;
  private touching: Resource[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, 'player', 'herald_idle_1');

    const { Body, Bodies } = (Phaser.Physics.Matter as any).Matter;
    const playerCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'playerCollider' });
    const playerSensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, label: 'playerSensor' });
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.5,
    });

    this.createMiningCollision(playerSensor);
    this.createPickCollision(playerCollider);
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
    this.scene.add.existing(this);

    this.weapon = new Phaser.GameObjects.Sprite(scene, 0, 0, 'items', 162);
    this.weapon.setOrigin(0.25, 0.75);
    this.weapon.setScale(0.8);
    this.scene.add.existing(this.weapon);
    this.scene.input.on('pointermove', (pointer : { worldX: number }) => this.setFlipX(pointer.worldX < this.x));

    this.inputKeys = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>;
  }

  private get velocity() {
    return this.body.velocity;
  }

  private whack() {
    for (const resource of this.touching) {
      if (resource.hit && !resource.dead) {
        resource.hit();
      }
    }
  }

  private weaponRotate() {
    const pointer = this.scene.input.activePointer;

    if (this.weaponRotation >= 100) this.whack();

    this.weaponRotation = pointer.isDown && this.weaponRotation < 100 ? this.weaponRotation + 6 : 0;
    this.weapon.setAngle(this.flipX ? -this.weaponRotation - 90 : this.weaponRotation);
  }

  private createMiningCollision(playerSensor: any) {
    (this.scene as any).matterCollision?.addOnCollideStart({
      objectA: [playerSensor],
      callback: ({ bodyB, gameObjectB }: any) => {
        if (bodyB.isSensor) return;
        this.touching.push(gameObjectB);
      },
      context: this.scene,
    });

    (this.scene as any).matterCollision?.addOnCollideEnd({
      objectA: [playerSensor],
      callback: ({ gameObjectB }: any) => {
        this.touching = this.touching.filter(gameObject => gameObject !== gameObjectB);
      },
      context: this.scene,
    });
  }

  private createPickCollision(playerCollider: any) {
    (this.scene as any).matterCollision?.addOnCollideStart({
      objectA: [playerCollider],
      callback: ({ gameObjectB }: any) => {
        if (gameObjectB && gameObjectB.pick) gameObjectB.pick();
      },
      context: this.scene,
    });

    (this.scene as any).matterCollision?.addOnCollideActive({
      objectA: [playerCollider],
      callback: ({ gameObjectB }: any) => {
        if (gameObjectB && gameObjectB.pick) gameObjectB.pick();
      },
      context: this.scene,
    });
  }

  static preload(scene: Phaser.Scene) {
    scene.load.atlas('player', '/assets/player_sprite.png', '/assets/player_atlas.json');
    scene.load.animation('player_anim', '/assets/player_anim.json');
    scene.load.spritesheet('items', '/assets/items.png', { frameWidth: 32, frameHeight: 32 });
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
    playerVelocity.scale(3);
    this.setVelocity(playerVelocity.x, playerVelocity.y);

    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.anims.play('player_walk', true);
    } else {
      this.anims.play('player_idle', true);
    }

    this.weapon?.setPosition(this.x, this.y);
    this.weaponRotate();
  }
}