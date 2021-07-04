import Phaser from 'phaser';

import { Drop } from './Drop';

export class Resource extends Phaser.Physics.Matter.Sprite {
  private health = 5;
  private sound: Phaser.Sound.BaseSound;
  private readonly drops: [number, number];

  constructor(scene: Phaser.Scene, resource: Phaser.Types.Tilemaps.TiledObject) {
    super(scene.matter.world, resource.x!, resource.y!, 'resources', resource.type);
    const { Bodies } = (Phaser.Physics.Matter as any).Matter;
    const yOrigin = resource.properties.find((p: any) => p.name === 'yOrigin').value;

    this.drops = JSON.parse(resource.properties.find((p: any) => p.name === 'drops')?.value ?? '');
    this.name = resource.type;
    this.x += this.width / 2;
    this.y -= this.height / 2;
    this.y = this.y + this.height * (yOrigin - 0.5);

    const circleCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'collider' });

    this.setExistingBody(circleCollider);
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);

    this.scene.add.existing(this);
    this.sound = this.scene.sound.add('resource_hit');
  }

  public get dead() {
    return this.health <= 0;
  }

  static preload(scene: Phaser.Scene) {
    scene.load.atlas('resources', '/assets/resources_sprite.png', '/assets/resources_atlas.json');
    scene.load.audio('resource_hit', '/assets/resource_hit.wav');
  }

  public hit() {
    this.health--;
    this.sound.play();

    if (this.dead) {
      for (const drop of this.drops) {
        new Drop(this.scene, this.x, this.y, drop);
      }
      this.destroy();
    }
  }
}