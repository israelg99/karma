import { phaser, items } from '../main/main';
import { debug } from '../util/debug-util';
import { Weapon } from '../weapons/weapon';

export class Item extends Phaser.Sprite {
    private readonly item: Weapon

    constructor(item: Weapon, x: number, y: number) {
        super(phaser, x, y, item.key + '_d')
        phaser.physics.enable(this, Phaser.Physics.ARCADE)
        this.anchor.setTo(0.25, -0.5)
        this.item = item
    }

    public pickup(): Weapon {
        this.destroy(true)
        return this.item
    }

    public static drop(sprite: Weapon, x?: number, y?: number): void {
        let tx: number = x ? x : sprite.x
        let ty: number = y ? y : sprite.y
        items.add(new Item(sprite, tx, ty))
    }
}