(global as any).p2 = require('phaser/build/p2.js');
(global as any).PIXI = require('phaser/build/pixi.js');
(global as any).Phaser = require('phaser/build/phaser.js');

import { Item } from './../items/item';
import { Player } from '../player/player'
import { Weapons } from '../weapons/weapons'
import { load_debug, debug } from '../util/debug-util';
import { PlayerBuilder } from '../player/player-builder';
import { Ak47 } from '../weapons/ak47';
import { M4A1 } from '../weapons/m4a1s';
import { Elite } from '../weapons/elite';
import { Plastic } from '../armor/plastic';
import { Armors } from '../armor/armors';

export let phaser: Phaser.Game = new Phaser.Game(1600, 800, Phaser.AUTO, '', )

export let cursors: Phaser.CursorKeys
export let wasd: Phaser.CursorKeys
export let pad1: Phaser.SinglePad
export let pickup_key: Phaser.Key

let local_player: Player
export let players: Phaser.Group
let playersAmount: number = 15

let world: Phaser.Tilemap
let layer: Phaser.TilemapLayer

export let items: Phaser.Group

export let HUD: Phaser.Group

function preload(): void {
    phaser.load.image('tiles', '../../assets/tiles/tiles.png')

    Weapons.preload()
    Player.preload()
    Armors.preload()
}

function create(): void {
    // TEMP VOLUME FOR DEBUGGING
    phaser.sound.volume = 0.2

    // PHYSICS
    phaser.physics.startSystem(Phaser.Physics.ARCADE)

    // INPUT
    cursors = phaser.input.keyboard.createCursorKeys()
    wasd = {
        up: phaser.input.keyboard.addKey(Phaser.Keyboard.W),
        down: phaser.input.keyboard.addKey(Phaser.Keyboard.S),
        left: phaser.input.keyboard.addKey(Phaser.Keyboard.A),
        right: phaser.input.keyboard.addKey(Phaser.Keyboard.D),
    };
    pad1 = phaser.input.gamepad.pad1
    pickup_key = phaser.input.keyboard.addKey(Phaser.Keyboard.E)
    phaser.input.gamepad.start()

    HUD = phaser.add.group()
    HUD.fixedToCamera = true

    // DEBUG
    load_debug()

    // WORLD MAP
    world = phaser.add.tilemap()
    world.addTilesetImage('tiles', 'tiles', 32, 32)

    layer = world.create('layer', 80, 80, 32, 32)
    layer.resizeWorld()

    for(let i = 0; i < world.width; i++) {
        for(let j=0; j < world.height; j++) {
            let tile: number
            if(j>world.height-world.height/3) {
                world.putTile(phaser.rnd.between(6, 13), i, j)
                continue
            }
            if(i>world.width/3 && i<world.width-world.width/3) {
                world.putTile(phaser.rnd.between(0, 2), i, j)
                continue
            }
            if((i<world.width/3 || i>world.width-world.width/3)) {
                world.putTile(phaser.rnd.between(3, 5), i, j)
                continue
            }
            world.putTile(phaser.rnd.between(0, 19), i, j)
        }
    }

    // ITEMS + POP
    items = phaser.add.group()
    items.add(new Item(new M4A1(), 100, 100))
    items.add(new Item(new Plastic(), 200, 200))

    // PLAYERS + CAMERA + POP
    players = phaser.add.group()

    local_player = PlayerBuilder.he()
                                .is('blue')
                                .at(32, 32)
                                .holds(new Elite())
                                .local()
                                .healthy()
                                .build()
    phaser.camera.follow(local_player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    players.add(local_player)
}

function update(): void {
    phaser.world.bringToTop(players)
    players.forEachExists((p: Player)=>p.update(), this)

    if(players.countLiving() < playersAmount) {
        let enemy = PlayerBuilder.he()
                             .is('blue')
                             .at(phaser.rnd.between(16, 3000)  , phaser.rnd.between(16, 3000))
                             .holds(new Ak47())
                             .outsider()
                             .healthy()
                             .build()
        players.add(enemy)
    }
}

function render(): void {
    phaser.world.bringToTop(HUD)
    players.forEachExists((p: Player)=>p.render(), this)
}

let karma: any = { preload: preload, create: create, update: update, render: render }

phaser.state.add('Karma', karma)
phaser.state.start('Karma')
