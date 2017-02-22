import { phaser } from './../main/main';
import { Armor } from './armor';

export class Plastic extends Armor {
    private static readonly health: number = 10
    private static readonly armor: number = 10

    constructor() {
        super(Plastic.health, Plastic.armor)
    }

    public static preload(): void {
        phaser.load.image('plastic_d', '../../assets/armor/plastic/plastic_d.png')
    }
}