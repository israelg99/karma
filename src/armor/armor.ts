import { RNG } from '../util/rng';
import { Plastic } from './plastic';
import { preload_dict } from '../util/preload';

export abstract class Armor {
    protected health: number
    protected armor: number

    constructor(health: number, armor: number) {
        this.health = RNG(health, 0.2)
        this.armor = RNG(armor, 0.2)
    }

    public get Health(): number {
        return this.health
    }
    public get Armor(): number {
        return this.armor
    }

    public mitigation(damage: number): number {
        return damage/(damage+this.armor)
    }

    public mitigate(damage: number): number {
        return Math.max(0, damage-this.mitigation(damage))
    }
}