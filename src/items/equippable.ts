import { Item } from './item';
import { Equippable } from './equippable';
import { Player } from './../player/player';

// Many of these functions could be implmeneted in the player class (DROP, LOOT and partially REPLACE).
// I choose to keep this design because I expect these functions to eventually become unique for individual objects..
// Almost all of these funcs could become static.

// I'll be cautious around this piece of code, expect major refactor here.

/* The reason I am abstracting the equipment out of the player is because there's only one player
   yet many equippable objects, so it is easier for the equipment to reason on the player than otherwise. */

export interface Equippable {
    dropRate: number

    replace(player: Player): void
    equip(player: Player): void
    unEquip(player: Player): Equippable
    drop(player: Player): void
    loot(player: Player): void
}

export function replace(target: Equippable, current: Equippable, player: Player): void {
    if(current) {
        current.drop(player)
    }
    target.equip(player)
}

export function drop(equip: Equippable, player: Player): void {
    Item.drop(equip.unEquip(player), player.body.x, player.body.y)
}

export function loot(equip: Equippable, player: Player): void {
    if(Math.random() > equip.dropRate) {
        equip.drop(player)
    }
}