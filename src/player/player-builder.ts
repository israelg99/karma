import { Player } from './player';
import { Ak47 } from './../weapons/ak47';
import { Weapon } from '../weapons/weapon';

export class PlayerBuilder {
    private weapon: Weapon
    private type: string
    private x: number
    private y: number
    private isLocal: boolean
    private health: number

    private constructor() {
        this.type = 'blue'
        this.weapon = new Ak47()
        this.x = 5
        this.y = 5
        this.health = Player.maxHealth
        this.isLocal = false
    }

    public static he(): PlayerBuilder {
        return new PlayerBuilder()
    }

    public build(): Player {
        return new Player(this)
    }

    get Weapon(): Weapon {
        return this.weapon
    }

    get Type(): string {
        return this.type
    }

    get X(): number {
        return this.x
    }

    get Y(): number {
        return this.y
    }

    get IsLocal(): boolean {
        return this.isLocal
    }

    get Health(): number {
        return this.health
    }

    is(type: string): PlayerBuilder {
        this.type = type
        return this
    }

    holds(weapon: Weapon): PlayerBuilder {
        this.weapon = weapon
        return this
    }

    at(x: number, y: number): PlayerBuilder {
        this.x = x
        this.y = y
        return this
    }

    local(): PlayerBuilder {
        this.isLocal = true
        return this
    }

    outsider(): PlayerBuilder {
        this.isLocal = false
        return this
    }

    healthy(): PlayerBuilder {
        this.health = Player.maxHealth
        return this
    }

    lit(health: number): PlayerBuilder {
        this.health = health
        return this
    }
}