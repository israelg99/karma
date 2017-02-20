import { players } from './../main/main';
import { phaser, pad1 } from '../main/main'
import { Weapon } from './weapon'
import { Player } from '../player/player';
import { Gun } from './gun';

export class Ak47 extends Gun {
    private static readonly ammo: number = 15
    private static readonly distance: number = 1000
    private static readonly speed: number = 2000
    private static readonly variance: number = 3
    private static readonly firerate: number = 100
    private static readonly dmg: number = 10
    private static readonly reloadSpeed: number = 1500

    constructor() {
        super('ak47', Ak47.ammo, Ak47.distance, Ak47.speed, Ak47.variance, Ak47.firerate, Ak47.dmg, Ak47.reloadSpeed, true)
    }

    public static preload(): void {
        phaser.load.image('ak47', '../../assets/weapon/ak47/ak47.png')
        phaser.load.image('ak47_d', '../../assets/weapon/ak47/ak47_d.png')
    }
}