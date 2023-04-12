import MatterEntity from "./MatterEntity";

export default class Player extends MatterEntity{
    isKnockedDown = false;
    isAttacking = false;
    isHarvesting=false;
    lastDirection="down";
    playerVelocity = new Phaser.Math.Vector2();
    speed = 4;
    scaleX = 1.3;
    scaleY = 1.3;
    // dust;
    constructor(data){
        let {scene,x,y,texture,frame}=data;
        super({...data,health:2,drops:[],name:'player'});
        this.touching =[];
        this.setBounce(0);
        this.setOrigin(0.5);
        this.setScale(this.scaleX, this.scaleY);
        this.setSize(1, 1);
    
        //weapon
        this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene,10,10,'items',162);
        this.spriteWeapon.setScale(0.95); //remove for WW -- or make bigger
        this.spriteWeapon.setOrigin(0.3,0.6);
        this.scene.add.existing(this.spriteWeapon);

        this.createPlayerAnims();
        const{Body, Bodies} = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x, this.y, 12, {isSensor:false, label:'playerCollider'});
        var playerSensor = Bodies.circle(this.x,this.y, 24, {isSensor:true, label:'playerSensor'});
        const compoundBody = Body.create({
          parts:[playerCollider, playerSensor],
          frictionAir: 0.35,
        });
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
        this.createMiningCollisions(playerSensor);
        this.createPickupCollisions(playerCollider);
        this.setPointerFlip();
        // this.dust = this.scene.matter.add.sprite(90, 90, 'dust');
        // this.dust.setCollisionCategory(0);
        // this.dust.setScale(this.scaleX, this.scaleY);
        // this.dust.setSize(2, 2);
        // this.dust.setFixedRotation();
        // this.dust.setFrictionAir(0.35);
        // this.createDustAnims();
    }

    static preload(scene){
        scene.load.spritesheet("player", "assets/characters/player.png",{
            frameWidth:48,
            frameHeight:48,
          });
        scene.load.spritesheet('items','assets/objects/items.png', {
          frameWidth:32, 
          frameHeight:32
        })
        scene.load.audio('player', 'assets/audio/player.mp3')
        //  scene.load.spritesheet("dust", "assets/particles/dust_particles_01.png",{
        //     frameWidth:8,
        //     frameHeight:8,
        //   });
    }

    createPlayerAnims(){
        this.anims.create({
            key: 'attack_down',
            frames: this.anims.generateFrameNumbers('player', { start: 36, end: 39 }),
            frameRate: 10,
            repeat: -1,
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
            repeat: -1,
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

      // createDustAnims(){
      //   this.dust.anims.create({
      //     key: 'run_dust',
      //     frames: this.anims.generateFrameNumbers('dust', { start: 0, end: 3 }),
      //     frameRate: 10,
      //     repeat: -1,
      //   });
      // }

    update(data) {
      let isMoving = (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1)
      this.isAttacking = data.space.isDown; 
      this.isHarvesting = this.scene.input.activePointer.isDown && !isMoving;
        // console.log(this.isHarvesting)
        //================================  
        //  first priority, set default: 
        //================================  
        //if No input set to standing still
        if(!this.isAttacking && !this.isKnockedDown && !this.isHarvesting && !isMoving){
        // if(data.up.isUp && data.down.isUp && data.left.isUp && data.right.isUp
            //  && data.space.isUp && data.s1.isUp && !this.isKnockedDown){
            this.anims.play('stand_'+ this.lastDirection, true);
        }
        // //================================  
        // //  Next set important variables 
        // //================================  
        // //set attacking flag if currently attacking
      
        //set isKnockedDown to false if we are no longer in the knocked down animation 
        if(this.anims.currentAnim != null &&  this.anims.currentAnim.key == 'stand_'+this.lastDirection){
          this.isKnockedDown=false;
          this.setPointerFlip();
          
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
            this.scene.input.off('pointermove');
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
              this.playerVelocity.x=-1;
              this.anims.play('move_x', true); //only do the x animation if we arent moving diag
              this.lastDirection="left";
              this.setFlipX(true);
            } else if (data.right.isDown) {  // Move right
              this.playerVelocity.x=1;
              this.anims.play('move_x', true);
              // this.dust.anims.play('run_dust', true);
              this.lastDirection="right";
              this.setFlipX(false);
            } else {
              // Stop horizontal movement
              this.playerVelocity.x=0;
            }
          }
     
          this.playerVelocity.normalize();
          this.playerVelocity.scale(this.speed);
          
          this.setVelocity(this.playerVelocity.x, this.playerVelocity.y);
          // this.dust.setVelocity(this.playerVelocity.x, this.playerVelocity.y)
          // this.dust.setX(this.x-10);
          // this.dust.setY(this.playerVelocity.x-0.5);
         
          // console.log(this.scene.game.loop.actualFps);
       
        }
        this.weaponRotate();
      }

      weaponRotate(){
        if(this.isHarvesting && !this.isKnockedDown){
          this.spriteWeapon.setPosition(this.x,this.y);
          this.weaponRotation +=4; //ww to 10
          if(this.weaponRotation > 100){ //remove for WW
            this.harvest();
            this.weaponRotation =0;
          }
          if(this.flipX){
            this.spriteWeapon.setAngle(-this.weaponRotation - 90); //backwards rotation and flip the axe 90 deg
          }else{
            this.spriteWeapon.setAngle(this.weaponRotation);
          }
        }else{
          this.spriteWeapon.setPosition(-10,-10);//how can i hide this better?
          this.weaponRotation =0;
        }
      }

      createMiningCollisions(playerSensor){
        console.log(playerSensor)
        this.scene.matterCollision.addOnCollideStart({ //phaser-matter-collision-plugin
          objectA:[playerSensor],
          callback: other=>{
            if(other.bodyB.isSensor){
              return;
            }
            this.touching.push(other.gameObjectB);
            console.log(this.touching.length,other.gameObjectB.name)
          },
          context: this.scene,
        });
        this.scene.matterCollision.addOnCollideEnd({
          objectA:[playerSensor],
          callback: other => {
            this.touching = this.touching.filter(gameObject => gameObject != other.gameObjectB);
            console.log(this.touching.length);
          },
          context: this.scene,
        })
      }

      createPickupCollisions(playerCollider){
     
        this.scene.matterCollision.addOnCollideStart({ //phaser-matter-collision-plugin
          objectA:[playerCollider],
          callback: other=>{
             if(other.gameObjectB && other.gameObjectB.pickup){//object exists and has the pickup method.
              other.gameObjectB.pickup();
             }
          },
          context: this.scene,
        });
        this.scene.matterCollision.addOnCollideActive({
          objectA:[playerCollider],
          callback: other => {
            if(other.gameObjectB && other.gameObjectB.pickup){//object exists and has the pickup method.
              other.gameObjectB.pickup();
             }
          },
          context: this.scene,
        })
      }

      setPointerFlip(){
        this.scene.input.on('pointermove', pointer =>  this.setFlipX(pointer.worldX < this.x));//fired on mouse move // remove for WW
      }

      harvest(){
        this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead); //only hit things than can be hittable and not dead
        this.touching.forEach(gameObject =>{
          gameObject.hit();
          if(gameObject.dead){ //check resource.js
            gameObject.destroy();
          }
        })
      }
      //todo disable pickaxe when fainted, or use 2 to bring out pick axe
      //disable setflipX on fainated
      //setup whirlwind!
}