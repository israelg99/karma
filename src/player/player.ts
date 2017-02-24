import { reload_key } from './../main/main';
import { Armors } from './../armor/armors';
import { Equippable } from './../items/equippable';
import { Item } from './../items/item';
import { phaser, cursors, pad1, items, wasd, pickup_key, HUD, hud_key } from '../main/main';
import { Weapon } from '../weapons/weapon'
import { Ak47 } from '../weapons/ak47';
import { debug } from '../util/debug-util';
import { PlayerBuilder } from './player-builder';
import { WeaponType } from '../weapons/weapons';
import { Armor } from '../armor/armor';
import { Gun } from '../weapons/gun';

export class Player extends Phaser.Sprite {
    public static readonly maxHealth: number = 100
    private static readonly speed: number = 200

    private static readonly blood_frames: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

    public weapon: Weapon
    public armor: Armor

    private readonly isLocal: boolean

    private readonly bloodEmitter: Phaser.Particles.Arcade.Emitter

    private readonly HUD_health: Phaser.Text
    private readonly HUD_ammo: Phaser.Text

    private readonly extended_hud: Phaser.Group
    private readonly HUD_armor: Phaser.Text
    private readonly HUD_weapon: Phaser.Text

    constructor(builder: PlayerBuilder) {
        // Sprite
        super(phaser, builder.X, builder.Y, builder.Type, 1)
        this.anchor.setTo(0.4, 0.5)
        this.scale.setTo(2, 2)

        // Physics
        phaser.physics.enable(this, Phaser.Physics.ARCADE)

        // Player
        this.health = builder.Health
        this.maxHealth = Player.maxHealth
        this.isLocal = builder.IsLocal

        // Weapon
        builder.Weapon.equip(this)

        // Armor
        this.armor = undefined

        // Blood
        this.bloodEmitter = phaser.add.emitter(0, 0, 15)
        this.bloodEmitter.setScale(0.05, 0.15, 0.05, 0.15, 0)
        this.bloodEmitter.setSize(8, 8)
        this.bloodEmitter.setXSpeed(-150, 150)
        this.bloodEmitter.setYSpeed(-150, 150)
        this.bloodEmitter.makeParticles('blood', Player.blood_frames)
        this.addChild(this.bloodEmitter)

        // Death
        // TODO : Implement drops here.
        this.events.onKilled.add((p: Player) => p.death(), this)

        // If local
        if(this.isLocal) {
            // Listen to pickup key (input).
            pickup_key.onDown.add(this.pickup, this)

            // HUD
            this.extended_hud = phaser.add.group()

            this.HUD_health = phaser.add.text(0, 0, String(this.health), undefined)
            this.HUD_health.fontSize = 32
            this.HUD_health.fill = '#922B21'
            this.HUD_health.stroke = '#000000'
            this.HUD_health.strokeThickness = 2
            this.HUD_health.anchor.setTo(0.5)
            this.HUD_health.x = this.HUD_health.width + 16
            this.HUD_health.y = phaser.canvas.height - this.HUD_health.height - 16
            HUD.add(this.HUD_health)

            this.HUD_ammo = phaser.add.text(0, 0, this.weapon.getHUD(), undefined)
            this.HUD_ammo.fontSize = 32
            this.HUD_ammo.fill = '#1E8449'
            this.HUD_ammo.stroke = '#000000'
            this.HUD_ammo.strokeThickness = 2
            this.HUD_ammo.anchor.setTo(0.5)
            this.HUD_ammo.x = phaser.canvas.width - this.HUD_ammo.width - 16
            this.HUD_ammo.y = phaser.canvas.height - this.HUD_ammo.height - 16
            HUD.add(this.HUD_ammo)

            this.HUD_weapon = phaser.add.text(0, 0, String(0), undefined)
            this.HUD_weapon.fontSize = 32
            this.HUD_weapon.fill = '#FFFFFF'
            this.HUD_weapon.stroke = '#000000'
            this.HUD_weapon.strokeThickness = 2
            this.HUD_weapon.anchor.setTo(0.5)
            this.HUD_weapon.x = this.HUD_weapon.width + 16
            this.HUD_weapon.y = this.HUD_weapon.height + 16
            this.extended_hud.add(this.HUD_weapon)

            this.HUD_armor = phaser.add.text(0, 0, this.weapon.getHUD(), undefined)
            this.HUD_armor.fontSize = 32
            this.HUD_armor.fill = '#FFFFFF'
            this.HUD_armor.stroke = '#000000'
            this.HUD_armor.strokeThickness = 2
            this.HUD_armor.anchor.setTo(0.5)
            this.HUD_armor.x = phaser.canvas.width - this.HUD_armor.width - 16
            this.HUD_armor.y = this.HUD_armor.height + 16
            this.extended_hud.add(this.HUD_armor)

            HUD.add(this.extended_hud)
        }
    }

    private death(): void {
        for(let equip of this.equipment) {
            equip.loot(this)
        }

        this.destroy(true)
        return
    }

    private get equipments(): Equippable[] {
        return [this.weapon, this.armor]
    }
    private get equipment(): Equippable[] {
        return this.equipments.filter((e) => e)
    }

    private pickup(): void {
        let pickable_items: Item[] = []
        phaser.physics.arcade.overlap(this, items, (s: Player, i: Item) => pickable_items.push(i), null, this);

        if(pickable_items.length > 0) {
            pickable_items[0].pickup().replace(this)
        }
    }

    public update(): void {
        super.update()

        this.body.velocity.setTo(0, 0)
        if(this.isLocal) {
            this.listen()
            this.updateHUD()
        }

        this.weapon.update()
    }

    private listen(): void {
        this.listenMovement()
        this.listenHUD()
        this.weapon.listen()
    }

    private listenMovement(): void {
        // TODO - Add support for gamepad.
        this.rotation = phaser.physics.arcade.angleToPointer(this)

        let left: boolean = pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1 || cursors.left.isDown || wasd.left.isDown
        let right: boolean = pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1 || cursors.right.isDown || wasd.right.isDown
        let up: boolean = pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1 || cursors.up.isDown || wasd.up.isDown
        let down: boolean = pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1 || cursors.down.isDown || wasd.down.isDown

        let horizontal: boolean = left || right
        let horizonal_block: boolean = left && right

        let vertical: boolean = up || down
        let vertical_block: boolean = up && down

        let diagonal: boolean = horizontal && vertical

        this.body.velocity.x = !horizontal || horizonal_block ? 0 : right ? Player.speed : -Player.speed
        this.body.velocity.y = !vertical || vertical_block ? 0 : down ? Player.speed : -Player.speed

        // if (diagonal) {
        //     this.body.velocity.divide(2, 2)
        // }
    }

    private listenHUD() {
        this.extended_hud.visible = hud_key.isDown
    }

    private updateHUD() {
        this.HUD_health.text = String(this.health)
        this.HUD_health.x = this.HUD_health.width + 16
        this.HUD_health.y = phaser.canvas.height - this.HUD_health.height - 16

        this.HUD_ammo.text = this.weapon.getHUD()
        this.HUD_ammo.x = phaser.canvas.width - this.HUD_ammo.width - 16
        this.HUD_ammo.y = phaser.canvas.height - this.HUD_ammo.height - 16

        this.HUD_weapon.text = this.weapon.getExtendedHUD()
        this.HUD_weapon.x = this.HUD_weapon.width/2 + 16
        this.HUD_weapon.y = this.HUD_weapon.height/2 + 16

        this.HUD_armor.text = this.armor ? `Armor: ${this.armor.Armor}` : "You have no armor."
        this.HUD_armor.x = phaser.canvas.width - this.HUD_armor.width - 16
        this.HUD_armor.y = this.HUD_armor.height + 16
    }

    public render(): void {
        if(this.isLocal) {
            debug(this, 16)
            debug(this.weapon, 200)
        }

        this.weapon.render()
    }

    public damage(amount: number): Phaser.Sprite {
        super.damage(this.armor ? this.armor.mitigate(amount) : amount)
        this.bloodEmitter.start(true, 135, null, 20)
        return this
    }

    public static preload(): void {
        phaser.load.spritesheet('blue', '../../assets/player/blue.png', 32, 32)

        phaser.load.spritesheet('blood', '../../assets/particles/blood.png', 32, 32)
    }
}