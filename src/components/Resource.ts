import Phaser from 'phaser';

export class Resource extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, resource: Phaser.Types.Tilemaps.TiledObject) {
    super(scene.matter.world, resource.x!, resource.y!, 'resources', resource.type);
    const { Bodies } = (Phaser.Physics.Matter as any).Matter;
    const yOrigin = resource.properties.find((p: any) => p.name === 'yOrigin').value;

    this.x += this.width / 2;
    this.y -= this.height / 2;
    this.y = this.y + this.height * (yOrigin - 0.5);

    const circleCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'collider' });

    this.setExistingBody(circleCollider);
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);

    this.scene.add.existing(this);
  }

  static preload(scene: Phaser.Scene) {
    scene.load.atlas('resources', '/assets/resources_sprite.png', '/assets/resources_atlas.json');
  }
}