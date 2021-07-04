import Phaser from 'phaser';

import { Player, Resource } from '../components';

export class MainScene extends Phaser.Scene {
  private player?: Player;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('tileset', '/assets/tileset.png');
    this.load.tilemapTiledJSON('map', '/assets/map.json');
    Player.preload(this);
    Resource.preload(this);
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tileset', 32, 32);
    const earthLayer = map.createLayer('earth_layer', tileset, 0, 0);
    const resources = map.getObjectLayer('resources').objects;

    earthLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(earthLayer);

    for (const resource of resources) {
      new Resource(this, resource);
    }

    this.player = new Player(this, 100 , 100);
  }

  update() {
    this.player?.update();
  }
}
