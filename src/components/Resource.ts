import Phaser from 'phaser';

import { MatterEntity } from './MatterEntity';

const HEALTH = 5;
const SOUND_KEY = 'resource_hit';

export class Resource extends MatterEntity {
  constructor(scene: Phaser.Scene, resource: Phaser.Types.Tilemaps.TiledObject) {
    super({
      scene,
      drops: JSON.parse(resource.properties.find((p: any) => p.name === 'drops')?.value),
      depth: resource.properties.find((p: any) => p.name === 'depth')?.value,
      x: resource.x!,
      y: resource.y!,
      texture: 'resources',
      name: resource.type,
      soundKey: SOUND_KEY,
      frame: resource.type,
      health: HEALTH,
    });
    const { Bodies } = (Phaser.Physics.Matter as any).Matter;
    const yOrigin = resource.properties.find((p: any) => p.name === 'yOrigin').value;
    this.y = this.y + this.height * (yOrigin - 0.5);

    const circleCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'collider' });

    this.setExistingBody(circleCollider);
    this.setStatic(true);
    this.setOrigin(0.5, yOrigin);
  }

  static preload(scene: Phaser.Scene) {
    scene.load.atlas('resources', '/assets/resources_sprite.png', '/assets/resources_atlas.json');
    scene.load.audio(SOUND_KEY, '/assets/resource_hit.wav');
  }

  public onDeath() {
    this.destroy();
  }
}