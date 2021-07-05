import Phaser from 'phaser';

export class Drop extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, frame?: string | number) {
    super(scene.matter.world, x, y, 'items', frame);

    const { Bodies } = (Phaser.Physics.Matter as any).Matter;
    const circleCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'collider' });

    this.setExistingBody(circleCollider);
    this.setFrictionAir(1);
    this.setScale(0.5);
    this.scene.add.existing(this);
  }

  public pick() {
    this.destroy();
  }
}