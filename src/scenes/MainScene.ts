import Phaser from 'phaser';

import { Player } from '../components';

export class MainScene extends Phaser.Scene {
  private player?: Player;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('tileset', '/assets/tileset.png');
    this.load.tilemapTiledJSON('map', '/assets/map.json');
    Player.preload(this);
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tileset', 32, 32);
    const earthLayer = map.createLayer('earth_layer', tileset, 0, 0);

    earthLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(earthLayer);

    this.player = new Player(this, 100 , 100, 'player', 'herald_idle_1');
    new Player(this, 200 , 200, 'player', 'herald_idle_1');
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update() {
    this.player?.update();
  }
}
