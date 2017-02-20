import { players } from './../main/main';
import { phaser, pad1 } from '../main/main'
import { Weapon } from './weapon'
import { Player } from '../player/player';
import { Gun } from './gun';

export class M4A1 extends Gun {
    private static readonly ammo: number = 30
    private static readonly distance: number = 1000
    private static readonly speed: number = 1500
    private static readonly variance: number = 6
    private static readonly firerate: number = 50
    private static readonly dmg: number = 10
    private static readonly reloadSpeed: number = 2000

    constructor() {
        super('m4a1', M4A1.ammo, M4A1.distance, M4A1.speed, M4A1.variance, M4A1.firerate, M4A1.dmg, M4A1.reloadSpeed, true)
    }

    public track(parent: Phaser.Sprite): void {
        super.track(parent)
        this.gun.trackSprite(parent, 62, 0, true)
    }

    public static preload(): void {
        phaser.load.image('m4a1', '../../assets/weapon/m4a1/m4a1.png')
        phaser.load.image('m4a1_d', '../../assets/weapon/m4a1/m4a1_d.png')
    }
}