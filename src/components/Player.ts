import Phaser from 'phaser';

export class Player extends Phaser.Physics.Matter.Sprite {
  public inputKeys?: Record<string, Phaser.Input.Keyboard.Key>;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number, options?: Phaser.Types.Physics.Matter.MatterBodyConfig) {
    super(scene.matter.world, x, y, texture, frame, options);
    const { Body, Bodies } = (Phaser.Physics.Matter as any).Matter;
    const playerCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'playerCollider' });
    const playerSensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, label: 'playerSensor' });
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.5,
    });

    this.setExistingBody(compoundBody);
    this.setFixedRotation();
    this.scene.add.existing(this);
  }

  get velocity() {
    return this.body.velocity;
  }

  static preload(scene: Phaser.Scene) {
    scene.load.atlas('player', '/assets/player_sprite.png', '/assets/player_atlas.json');
    scene.load.animation('player_anim', '/assets/player_anim.json');
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
  }
}