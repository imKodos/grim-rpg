import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import Player from './player.js';

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
      height: 600,
      width: 800,
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
      // plugins:{
      //   scene:[
      //     {
      //       plugin: PhaserMatterCollisionPlugin,
      //       key: 'matterCollision',
      //       mapping: 'matterCollision'
      //     }
      //   ]
      // }
      // physics: {
      //   default: 'arcade',
      //   arcade: {
      //      debug: true,
      //      gravity: { y: 0 },
      //   }
      // }
    
    };
  }
  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
}

class MainScene extends Phaser.Scene {
  private player!: Player;
  // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  // private w!: Phaser.Input.Keyboard.Key;
  // private a!: Phaser.Input.Keyboard.Key;
  // private s!: Phaser.Input.Keyboard.Key;
  // private d!: Phaser.Input.Keyboard.Key;
  // private s1!: Phaser.Input.Keyboard.Key;
  // private space!: Phaser.Input.Keyboard.Key;
  private keys!:any;
  // private playerVelocity = new Phaser.Math.Vector2();
  constructor() {
    super({ key: 'MainScene' });
    
  }
  preload() {
    Player.preload(this);
    // this.load.spritesheet("player", "assets/characters/player.png",{
    //   frameWidth:48,
    //   frameHeight:48
    // })
  }

  create() {
  // Initialize cursor keys
  //  this.cursors = this.input.keyboard.createCursorKeys();
   this.keys = this.input.keyboard.addKeys({ 
    'up': Phaser.Input.Keyboard.KeyCodes.W,
    'down': Phaser.Input.Keyboard.KeyCodes.S,
    'left': Phaser.Input.Keyboard.KeyCodes.A,
    'right': Phaser.Input.Keyboard.KeyCodes.D,
    'space': Phaser.Input.Keyboard.KeyCodes.SPACE,
    's1': Phaser.Input.Keyboard.KeyCodes.ONE
  });
  
   this.player = new Player({scene:this,x:100,y:100,texture:"player"});

    // Define animations for player spritesheet
    // this.anims.create({
    //   key: 'attack_down',
    //   frames: this.anims.generateFrameNumbers('player', { start: 36, end: 39 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'attack_right',
    //   frames: this.anims.generateFrameNumbers('player', { start: 42, end: 45 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'attack_left',
    //   frames: this.anims.generateFrameNumbers('player', { start: 42, end: 45 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'attack_up',
    //   frames: this.anims.generateFrameNumbers('player', { start: 48, end: 51 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'move_x',
    //   frames: this.anims.generateFrameNumbers('player', { start: 24, end: 29 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'up',
    //   frames: this.anims.generateFrameNumbers('player', { start: 30, end: 35 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'down',
    //   frames: this.anims.generateFrameNumbers('player', { start: 18, end: 23 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'stand_down',
    //   frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'stand_up',
    //   frames: this.anims.generateFrameNumbers('player', { start: 12, end: 17 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'stand_left',
    //   frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
    //   frameRate: 10,
    //   repeat: -1
    // });
    // this.anims.create({
    //   key: 'stand_right',
    //   frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
    //   frameRate: 10,
    //   repeat: -1
    // });

    // this.anims.create({
    //   key: 'dead',
    //   frames: this.anims.generateFrameNumbers('player', { start: 54, end: 56 }),
    //   frameRate: 4,
    //   repeat: -1,
    // });
    // this.anims.create({
    //   key: 'laying',
    //   frames: this.anims.generateFrameNumbers('player', { start: 56, end: 56 }),
    //   frameRate: 10,
    //   repeat: 10,
    // });
  }

  override update(){
    // this.player.setMovement(this.cursors);
    this.player.update(this.keys);
  }
  
  //  override update() {
  //   //================================  
  //   //  first priority, set default: 
  //   //================================  
  //   //if No input set to standing still
  //   if(this.cursors.up.isUp && this.cursors.down.isUp && this.cursors.left.isUp && this.cursors.right.isUp &&
  //     this.w.isUp && this.a.isUp && this.s.isUp && this.d.isUp && this.space.isUp && this.s1.isUp && !this.isKnockedDown){
  //       this.player.anims.play('stand_'+this.lastDirection, true);
  //   }

  //   //================================  
  //   //  Next set important variables 
  //   //================================  
  //   //set attacking flag if currently attacking
  //   this.isAttacking = this.space.isDown; 
  //   //set isKnockedDown to false if we are no longer in the knocked down animation 
  //   if(this.player.anims.currentAnim.key == 'stand_'+this.lastDirection){
  //     this.isKnockedDown=false;
  //   }

  //   //================================  
  //   //  Game Logic 
  //   //================================  
  //   //we can't do anything if we are currently knocked down/incapacitated
  //   if(!this.isKnockedDown){
  //     //set the isKnockedDown flag if conditions are met and run the appropriate animation
  //     if (this.s1.isDown) {
  //       this.playerVelocity.x=0;
  //       this.playerVelocity.y=0;
  //       this.player.setVelocity(this.playerVelocity.x, this.playerVelocity.y);
  //       this.isKnockedDown=true;
  //       this.player.anims.play('dead');
  //       this.player.anims.stopAfterRepeat(0);
  //       this.player.anims.chain('laying');
  //       this.player.anims.chain('stand_'+this.lastDirection);
  //       return; //skip the rest of the update 
  //     }
  //     //if we are currently attacking, dont allow movement
  //     if (this.isAttacking) {
  //       this.playerVelocity.x=0;
  //       this.playerVelocity.y=0;
  //       this.player.anims.play('attack_'+this.lastDirection, true);
  //     }else{ //not attacking, check movement
  //       if (this.cursors.up.isDown || this.w.isDown) {  // Move up
  //         this.playerVelocity.y=-1;
  //         if(this.playerVelocity.x == 0){
  //           this.player.anims.play('up', true);
  //         }
  //         this.lastDirection="up";
  //       } else if (this.cursors.down.isDown || this.s.isDown) {   // Move down
  //         this.playerVelocity.y=1;
  //         if(this.playerVelocity.x == 0){
  //           this.player.anims.play('down', true);
  //         }
  //         this.lastDirection="down";
  //       } else {
  //         // Stop vertical movement
  //         this.playerVelocity.y=0;
  //       }

  //       if (this.cursors.left.isDown || this.a.isDown) { // Move left
  //         this.player.setScale(-this.scaleX,this.scaleY);
  //         this.playerVelocity.x=-1;
  //         // if(this.playerVelocity.y == 0){
  //         this.player.anims.play('move_x', true); //only do the x animation if we arent moving diag
  //         // }
  //         this.lastDirection="left";
  //       } else if (this.cursors.right.isDown || this.d.isDown) {  // Move right
  //         this.playerVelocity.x=1;
  //         // if(this.playerVelocity.y == 0){
  //         this.player.anims.play('move_x', true);
  //         // }
  //         this.player.setScale(this.scaleX,this.scaleY);
  //         this.lastDirection="right";
  //       } else {
  //         // Stop horizontal movement
  //         this.playerVelocity.x=0;
  //       }
      
  //     }
  //     this.playerVelocity.normalize();
  //     this.playerVelocity.scale(this.speed);
  //     this.player.setVelocity(this.playerVelocity.x, this.playerVelocity.y);
  //   }
  //  }

}