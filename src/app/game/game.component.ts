import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import { PhaserMatterCollisionPlugin } from 'src/assets/phaser-matter-collision.js';
import Player from './player.js';
import Resource from './resource.js';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  phaserGame!: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 512,
      width: 512,
      scene: [ MainScene ],
      parent: 'gameContainer',
      title: "Grim RPG",
      backgroundColor: "#18216D",
      physics: {
        default: 'matter',
        matter: {
           debug:true,
           gravity: { y: 0 }
        }
      },
        plugins: {
    scene:[
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision'
      }
    ]
  }
    };
  }
  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
}

class MainScene extends Phaser.Scene {
  private player!: Player;
  private keys!:any;
  private map!: Phaser.Tilemaps.Tilemap;
  constructor() {
    super({ key: 'MainScene' });
    
  }
  preload() {
    Player.preload(this);
    Resource.preload(this);
    this.load.image('tiles', 'assets/tilesets/RPG Nature Tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
  }

  create() {
  // Initialize cursor keys
   this.keys = this.input.keyboard.addKeys({ 
    'up': Phaser.Input.Keyboard.KeyCodes.W,
    'down': Phaser.Input.Keyboard.KeyCodes.S,
    'left': Phaser.Input.Keyboard.KeyCodes.A,
    'right': Phaser.Input.Keyboard.KeyCodes.D,
    'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
    's1': Phaser.Input.Keyboard.KeyCodes.ONE
  });
  
   const map = this.make.tilemap({key: 'map'});
   this.map=map;
   const tileset = map.addTilesetImage('RPG Nature Tileset', 'tiles', 32,32,0,0);
   const layer1 = map.createLayer('Tile Layer 1', tileset, 0,0);
   const layer2 = map.createLayer('Tile Layer 2', tileset, 0,0);
   layer1.setCollisionByProperty({collides: true});
   this.matter.world.convertTilemapLayer(layer1);

   this.map.getObjectLayer('Resources').objects.forEach(resource=> new Resource({scene:this, resource}));;


   this.player = new Player({scene:this,x:100,y:100,texture:"player"});
   this.player.setOrigin(0.51,0.7); //changes the center of the hitbox

  //  this.physics.world.setFPS(100);
  }

  override update(){
    this.player.update(this.keys);
  }
}

//angular specific cheatsheet
//const Bodies = this.matter.bodies;  // instead of // Phaser.Physics.Matter.Matter;