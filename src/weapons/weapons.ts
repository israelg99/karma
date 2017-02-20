import { M4A1 } from './m4a1s';
import { phaser } from '../main/main';

import { Ak47 } from './ak47';
import { Gun } from './gun';
import { Elite } from './elite';

export enum WeaponType {
    Melee = 4,
    Pistol = 2,
    Rifle = 1
}

export class Weapons {
    private static readonly weapons: { [type: string]: any; } = {
        'ak47' : Ak47,
        'm4a1' : M4A1,
        'elite': Elite
    }

    public static readonly weaponTypes: { [type: string]: WeaponType; } = {
        'ak47' : WeaponType.Rifle,
        'm4a1' : WeaponType.Rifle,
        'elite': WeaponType.Pistol
    }

    public static preload(): void {
        Gun.preload()
        for(let weapon in Weapons.weapons) {
            if (Weapons.weapons.hasOwnProperty(weapon)) {
                Weapons.weapons[weapon].preload()
            }
        }
    }
}