import { players } from './../main/main';
import { phaser, pad1 } from '../main/main'
import { Weapon } from './weapon'
import { Player } from '../player/player';
import { Gun } from './gun';

export class Elite extends Gun {
    private static readonly ammo: number = 8
    private static readonly distance: number = 1000
    private static readonly speed: number = 2000
    private static readonly variance: number = 5
    private static readonly firerate: number = 100
    private static readonly dmg: number = 10
    private static readonly reloadSpeed: number = 1000

    constructor() {
        super('elite', Elite.ammo, Elite.distance, Elite.speed, Elite.variance, Elite.firerate, Elite.dmg, Elite.reloadSpeed, false)
    }

    public track(parent: Phaser.Sprite): void {
        super.track(parent)
        this.gun.trackSprite(parent, 62, -1, true)
    }

    public static preload(): void {
        phaser.load.image('elite', '../../assets/weapon/elite/elite.png')
        phaser.load.image('elite_d', '../../assets/weapon/elite/elite_d.png')
    }
}