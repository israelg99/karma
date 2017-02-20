import { phaser, pad1 } from '../main/main'
import { Ak47 } from './ak47'
import { WeaponType, Weapons } from './weapons';

export abstract class Weapon extends Phaser.Sprite {
    public readonly weaponType: WeaponType
    protected shootSFX: string
    protected shoot: Phaser.Sound
    private autofire: boolean
    private canFire: boolean

    constructor(type: string, autofire: boolean, shootSFX?: string) {
        super(phaser, 0, 0, type, 0)
        this.anchor.setTo(0, 0.5)

        this.weaponType = Weapons.weaponTypes[type]

        this.shootSFX = shootSFX ? shootSFX : type+'_shoot'
        this.shoot = undefined

        this.autofire = autofire
        this.canFire = true
    }

    public track(parent: Phaser.Sprite): void {
        this.x = 7
        this.y = -1
    }
    public render(): void { }

    // Must not include anything player-specific, such as input.
    // The gun cannot trigger itself!
    public update(): void { }

    public listen(): void {
        let to_fire: boolean = phaser.input.activePointer.isDown || pad1.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)
        if(!to_fire) {
            this.canFire = true
        }

        if (to_fire && (this.autofire || this.canFire)) {
            this.fire()
            this.canFire = false
        }
    }
    public abstract fire(): void

    public getHUD(): string {
        return ''
    }
}