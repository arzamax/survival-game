import Phaser from 'phaser';

import { Player, Resource, Enemy } from '../components';

export class MainScene extends Phaser.Scene {
  private player?: Player;
  private readonly enemies: Enemy[];

  constructor() {
    super('MainScene');
    this.enemies = [];
  }

  preload() {
    this.load.image('tileset', '/assets/tileset.png');
    this.load.tilemapTiledJSON('map', '/assets/map.json');
    Enemy.preload(this);
    Player.preload(this);
    Resource.preload(this);
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tileset', 32, 32);
    const earthLayer = map.createLayer('earth_layer', tileset, 0, 0);
    const resources = map.getObjectLayer('resources').objects;
    const enemies = map.getObjectLayer('enemies').objects;

    earthLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(earthLayer);

    for (const resource of resources) {
      new Resource(this, resource);
    }

    for (const enemy of enemies) {
      this.enemies.push(new Enemy(this, enemy));
    }

    this.player = new Player(this, 150 , 150);
  }

  update() {
    this.player?.update();

    for (const enemy of this.enemies) {
      enemy.update();
    }
  }
}
