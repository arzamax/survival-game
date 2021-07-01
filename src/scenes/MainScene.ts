import Phaser from 'phaser';

import { Player } from '../components';

export class MainScene extends Phaser.Scene {
  private map?: Phaser.Tilemaps.Tilemap;
  private player?: Player;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('tileset', '/assets/tileset.png');
    this.load.tilemapTiledJSON('map', '/assets/map.json');
    this.load.atlas('resources', '/assets/resources_sprite.png', '/assets/resources_atlas.json');
    Player.preload(this);
  }

  private addResources(map: Phaser.Tilemaps.Tilemap) {
    const resources = map.getObjectLayer('resources').objects;

    for (const resource of resources) {
      const resourceItem = new Phaser.Physics.Matter.Sprite(this.matter.world, resource.x!, resource.y!, 'resources', resource.type);
      const { Bodies } = (Phaser.Physics.Matter as any).Matter;
      const yOrigin = resource.properties.find((p: any) => p.name === 'yOrigin').value;

      resourceItem.x += resourceItem.width / 2;
      resourceItem.y -= resourceItem.height / 2;
      resourceItem.y = resourceItem.y + resourceItem.height * (yOrigin - 0.5);

      const circleCollider = Bodies.circle(resourceItem.x, resourceItem.y, 12, { isSensor: false, label: 'collider' });

      resourceItem.setExistingBody(circleCollider);
      resourceItem.setStatic(true);
      resourceItem.setOrigin(0.5, yOrigin);
      this.add.existing(resourceItem);
    }
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tileset', 32, 32);
    const earthLayer = map.createLayer('earth_layer', tileset, 0, 0);

    earthLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(earthLayer);

    this.addResources(map);

    this.player = new Player(this, 100 , 100, 'player', 'herald_idle_1');
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>;
  }

  update() {
    this.player?.update();
  }
}
