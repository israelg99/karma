import { Player } from './../player/player';
import { RNG } from '../util/rng';
import { Plastic } from './plastic';
import { preload_dict } from '../util/preload';
import { Equippable, replace, drop, loot } from '../items/equippable';

export abstract class Armor implements Equippable {
    public readonly dropRate: number = 0.5

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

    public replace(player: Player): void {
        replace(this, player.armor, player)
    }
    public drop(player: Player): void {
        drop(this, player)
    }
    public loot(player: Player): void {
        loot(this, player)
    }
    public equip(player: Player): void {
        player.armor = this
    }
    public unEquip(player: Player): Equippable {
        let armor: Armor = player.armor
        player.armor = undefined
        return armor
    }
}