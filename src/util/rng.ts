import { phaser } from '../main/main';

export function RNGESUS(stat: number, percent: number): number {
    return phaser.rnd.integerInRange(-stat*percent, stat*percent)
}

export function RNG(stat: number, percent: number): number {
    return stat + RNGESUS(stat, percent)
}