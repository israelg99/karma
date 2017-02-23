import { M4A1 } from './m4a1s';
import { players } from './../main/main';
import { phaser, pad1 } from '../main/main'
import { Weapon } from './weapon'
import { Player } from '../player/player';
import { RNG } from '../util/rng';

export abstract class Gun extends Weapon {
    protected ammo: number
    protected distance: number
    protected speed: number
    protected variance: number
    protected firerate: number
    protected dmg: number
    protected reloadSpeed: number

    private magazine: number
    private isReloading: boolean

    protected readonly gun: Phaser.Weapon

    constructor(type: string, ammo: number, distance: number, speed: number, variance: number, firerate: number, dmg: number, reloadSpeed: number, autofire: boolean, shootSFX?: string) {
        super(type, autofire, shootSFX)

        this.ammo = RNG(ammo, 0.2)
        this.distance = RNG(distance, 0.2)
        this.speed = RNG(speed, 0.2)
        this.variance = RNG(variance, 0.2)
        this.firerate = RNG(firerate, 0.2)
        this.dmg = RNG(dmg, 0.2)
        this.reloadSpeed = RNG(reloadSpeed, 0.2)

        this.gun = phaser.add.weapon(this.ammo, 'firearm_bullet')
        this.gun.bulletKillType = Phaser.Weapon.KILL_DISTANCE
        this.gun.bulletWorldWrap = false

        this.gun.bulletKillDistance = this.distance
        this.gun.bulletSpeed = this.speed
        this.gun.bulletAngleVariance = this.variance
        this.gun.fireRate = this.firerate

        this.reload()
        this.isReloading = false
        this.gun.onFire.add(this.playShoot, this)
        this.gun.onFire.add(this.updateMag, this)
    }

    public track(parent: Phaser.Sprite): void {
        super.track(parent)
        this.gun.trackSprite(parent, 62, -1, true)
    }

    public update(): void {
        super.update()
        phaser.physics.arcade.overlap(this.gun.bullets, players, this.hit, null, this);
    }

    public hit(bullet: Phaser.Sprite, target: Player): void {
        bullet.kill()
        target.damage(this.dmg)
    }

    public fire(): void {
        if(this.magazine > 0) {
            this.gun.fire()
            return
        }
        if(!this.isReloading) {
            this.isReloading = true
            phaser.time.events.add(this.reloadSpeed, this.reload, this)
        }
    }

    private reload() {
        this.magazine = this.ammo
        this.isReloading = false
    }

    private updateMag(b: Phaser.Bullet, w: Weapon): void {
        this.magazine--
    }

    private playShoot(b: Phaser.Bullet, w: Weapon): void {
        if(!this.shoot || this.shoot.currentTime > 100) {
            this.shoot = phaser.add.sound(this.key+'_shoot')
            this.shoot.play()
        }
    }

    public getHUD(): string {
        return this.magazine + '/' + this.ammo
    }
    public getExtendedHUD(): string {
        return `Ammo: ${this.ammo}\nDistance: ${this.distance}\nSpeed: ${this.speed}\nRecoil: ${this.variance}\nFirerate: ${this.firerate}\nDamage: ${this.dmg}\nReload: ${this.reloadSpeed}`
    }

    public static preload(): void {
        phaser.load.image('firearm_bullet', '../../assets/projectile/firearm_bullet_bright.png')

        phaser.load.audio('ak47_shoot', '../../assets/weapon/sfx/ak47.wav')
        phaser.load.audio('m4a1_shoot', '../../assets/weapon/sfx/m4a1.wav')
        phaser.load.audio('elite_shoot', '../../assets/weapon/sfx/elite.wav')
    }
}