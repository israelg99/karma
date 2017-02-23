import { phaser, items } from '../main/main';
import { debug } from '../util/debug-util';
import { Weapon } from '../weapons/weapon';
import { Equippable } from './equippable';

export class Item extends Phaser.Sprite {
    private readonly item: Equippable

    constructor(item: any, pos: Phaser.Point, key: string = item.constructor.name.toLowerCase()) {
        super(phaser, pos.x, pos.y, key + '_d')
        phaser.physics.enable(this, Phaser.Physics.ARCADE)
        this.anchor.setTo(0.25, -0.5)
        this.item = item
    }

    public pickup(): any {
        this.destroy(true)
        return this.item
    }

    public static drop(sprite: any, pos: Phaser.Point): void {
        items.add(new Item(sprite, pos))
    }
}