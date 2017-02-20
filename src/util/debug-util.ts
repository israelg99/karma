import { phaser } from './../main/main';
import { pad1 } from '../main/main';

let keyboard: Phaser.Key;
let controller: number;

export function load_debug(): void {
    keyboard = phaser.input.keyboard.addKey(Phaser.Keyboard.P)
    controller = Phaser.Gamepad.XBOX360_LEFT_TRIGGER
}

function isDebug() : boolean {
    return keyboard.isDown || pad1.isDown(controller)
}

export function debug(sprite: Phaser.Sprite, start: number) : void {
    if(!isDebug()) {
        phaser.debug.reset()
        return
    }

    phaser.debug.spriteInfo(sprite, 8, start)
    phaser.debug.bodyInfo(sprite, 8, start + 84)
    phaser.debug.body(sprite)

    phaser.debug.text('anchor', sprite.x + 2, sprite.y, 'red');
    phaser.debug.pixel(sprite.x-2, sprite.y-2, 'red', 4);
}