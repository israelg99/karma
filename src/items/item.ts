import { phaser, items } from '../main/main';
import { debug } from '../util/debug-util';
import { Weapon } from '../weapons/weapon';

export class Item extends Phaser.Sprite {
    private readonly item: Weapon

    constructor(item: any, x: number, y: number, key: string = item.constructor.name.toLowerCase()) {
        console.log(key)
        super(phaser, x, y, key + '_d')
        phaser.physics.enable(this, Phaser.Physics.ARCADE)
        this.anchor.setTo(0.25, -0.5)
        this.item = item
    }

    public pickup(): any {
        this.destroy(true)
        return this.item
    }

    public static drop(sprite: any, x?: number, y?: number): void {
        let tx: number = x ? x : sprite.x
        let ty: number = y ? y : sprite.y
        items.add(new Item(sprite, tx, ty))
    }
}