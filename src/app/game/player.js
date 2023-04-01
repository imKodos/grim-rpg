export default class Player extends Phaser.Physics.Matter.Sprite{
    isKnockedDown = false;
    isAttacking = false;
    lastDirection="down";
    playerVelocity = new Phaser.Math.Vector2();
    speed = 1.2;
    scaleX = 1.3;
    scaleY = 1.3;
    constructor(data){
        let {scene,x,y,texture}=data;
        super(scene.matter.world,x,y,texture);
        this.setBounce(0);
        this.setOrigin(0.5);
        this.setScale(this.scaleX, this.scaleY);
        this.setSize(1, 1);
        this.scene.add.existing(this);

        this.createPlayerAnims();
    }

    static preload(scene){
        scene.load.spritesheet("player", "assets/characters/player.png",{
            frameWidth:48,
            frameHeight:48
          })
    }

    createPlayerAnims(){
        this.anims.create({
            key: 'attack_down',
            frames: this.anims.generateFrameNumbers('player', { start: 36, end: 39 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'attack_right',
            frames: this.anims.generateFrameNumbers('player', { start: 42, end: 45 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'attack_left',
            frames: this.anims.generateFrameNumbers('player', { start: 42, end: 45 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'attack_up',
            frames: this.anims.generateFrameNumbers('player', { start: 48, end: 51 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'move_x',
            frames: this.anims.generateFrameNumbers('player', { start: 24, end: 29 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 30, end: 35 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 18, end: 23 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'stand_down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'stand_up',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 17 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'stand_left',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.create({
            key: 'stand_right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
          });
      
          this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers('player', { start: 54, end: 56 }),
            frameRate: 4,
            repeat: -1,
          });
          this.anims.create({
            key: 'laying',
            frames: this.anims.generateFrameNumbers('player', { start: 56, end: 56 }),
            frameRate: 10,
            repeat: 10,
          });
    }

    update(data) {
        // console.log(data.up.isDown)
        //================================  
        //  first priority, set default: 
        //================================  
        //if No input set to standing still
        if(data.up.isUp && data.down.isUp && data.left.isUp && data.right.isUp
             && data.space.isUp && data.s1.isUp && !this.isKnockedDown){
            this.anims.play('stand_'+ this.lastDirection, true);
        }
        // //================================  
        // //  Next set important variables 
        // //================================  
        // //set attacking flag if currently attacking
        this.isAttacking = data.space.isDown; 
        //set isKnockedDown to false if we are no longer in the knocked down animation 
        if(this.anims.currentAnim.key == 'stand_'+this.lastDirection){
          this.isKnockedDown=false;
        }
    
        // //================================  
        // //  Game Logic 
        // //================================  
        // //we can't do anything if we are currently knocked down/incapacitated
        if(!this.isKnockedDown){
          //set the isKnockedDown flag if conditions are met and run the appropriate animation
          if (data.s1.isDown) {
            this.playerVelocity.x=0;
            this.playerVelocity.y=0;
            this.setVelocity(this.playerVelocity.x, this.playerVelocity.y);
            this.isKnockedDown=true;
            this.anims.play('dead');
            this.anims.stopAfterRepeat(0);
            this.anims.chain('laying');
            this.anims.chain('stand_'+this.lastDirection);
            return; //skip the rest of the update 
          }
          //if we are currently attacking, dont allow movement
          if (this.isAttacking) {
            this.playerVelocity.x=0;
            this.playerVelocity.y=0;
            this.anims.play('attack_'+this.lastDirection, true);
          }else{ //not attacking, check movement
            if (data.up.isDown) {  // Move up
              this.playerVelocity.y=-1;
              if(this.playerVelocity.x == 0){
                this.anims.play('up', true);
              }
              this.lastDirection="up";
            } else if (data.down.isDown) {   // Move down
              this.playerVelocity.y=1;
              if(this.playerVelocity.x == 0){
                this.anims.play('down', true);
              }
              this.lastDirection="down";
            } else {
              // Stop vertical movement
              this.playerVelocity.y=0;
            }
    
            if (data.left.isDown) { // Move left
              this.setScale(-this.scaleX,this.scaleY);
              this.setFlipX(true);
              this.playerVelocity.x=-1;
              this.anims.play('move_x', true); //only do the x animation if we arent moving diag
              this.lastDirection="left";
            } else if (data.right.isDown) {  // Move right
              this.playerVelocity.x=1;
              this.anims.play('move_x', true);
              this.setFlipX(false);
            //   this.setScale(this.scaleX,this.scaleY);
              this.lastDirection="right";
            } else {
              // Stop horizontal movement
              this.playerVelocity.x=0;
            }
          
          }
          this.playerVelocity.normalize();
          this.playerVelocity.scale(this.speed);
          this.setVelocity(this.playerVelocity.x, this.playerVelocity.y);
        }
       }
}