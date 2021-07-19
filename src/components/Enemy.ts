import Phaser from 'phaser';
import { MatterEntity } from './MatterEntity';
import { Player } from './Player';

export class Enemy extends MatterEntity {
  private attacking?: Player | null;
  private attackTimer?: number | null;

  constructor(scene: Phaser.Scene, enemy: Phaser.Types.Tilemaps.TiledObject) {
    super({
      scene,
      x: enemy.x!,
      y: enemy.y!,
      texture: 'enemies',
      name: enemy.name,
      frame: `${enemy.name}_idle_1`,
      drops: JSON.parse(enemy.properties.find((p: any) => p.name === 'drops')?.value),
      health: enemy.properties.find((p: any) => p.name === 'health')?.value
    });

    const { Body, Bodies } = (Phaser.Physics.Matter as any).Matter;
    const enemyCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'playerCollider' });
    const enemySensor = Bodies.circle(this.x, this.y, 80, { isSensor: true, label: 'playerSensor' });
    const compoundBody = Body.create({
      parts: [enemyCollider, enemySensor],
      frictionAir: 0.5,
    });

    this.setExistingBody(compoundBody);
    this.setFixedRotation();
    (scene as any).matterCollision?.addOnCollideStart({
      objectA: [enemySensor],
      callback: ({ gameObjectB }: any) => {
        console.log(gameObjectB);
        if (gameObjectB && gameObjectB.name === 'player') {
          this.attacking = gameObjectB;
        }
      },
      context: this.scene,
    });
  }

  static preload(scene: Phaser.Scene) {
    scene.load.atlas('enemies', '/assets/enemies.png', '/assets/enemies_atlas.json');
    scene.load.animation('enemies_anim', '/assets/enemies_anim.json');
  }

  private attack(target: Player) {
    if (target.dead || this.dead) {
      if (this.attackTimer) {
        clearInterval(this.attackTimer);
      }
    } else {
      target.hit();
    }
  }

  public onDeath() {
    this.destroy();
  }

  public update() {
    if (!this.dead) {
      if (this.attacking && !this.attacking.dead) {
        const direction = this.attacking.position.subtract(this.position);

        if (direction.length() > 24) {
          direction.normalize();
          this.setVelocityX(direction.x);
          this.setVelocityY(direction.y);

          if (this.attackTimer) {
            clearInterval(this.attackTimer);
          }
        } else {
          if (!this.attackTimer) {
            this.attackTimer = setInterval(this.attack, 500, this.attacking);
          }
        }
        this.setFlipX(this.velocity.x < 0);

        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
          this.anims.play(`${this.name}_walk`, true);
        } else {
          this.anims.play(`${this.name}_idle`, true);
        }
      }
    }
  }
}
