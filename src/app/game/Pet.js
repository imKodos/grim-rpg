import MatterEntity from "./MatterEntity";

export default class Pet extends MatterEntity {
    speed = 3;

    static preload(scene){
        scene.load.spritesheet("pet", "assets/characters/pet.png",{
            frameWidth:32,
            frameHeight:32,
        });
        scene.load.audio('pet', 'assets/audio/player.mp3')
    }

    constructor(data){
      let {scene, pet} = data;
      //let health = enemy.properties.find(p=>p.name=='health').value;
      let drops = [];
      let health = 1;
      //super({scene, x:250, y:250, texture:'pet', health:1,drops:[],name:'pet'});
      super({...data,health:1,drops:[],name:'pet'});
      //super({scene, x:enemy.x, y:enemy.y,texture:'enemies', frame:`${enemy.name}_idle_1`,drops,health,name:enemy.name});
        this.touching =[];
        this.setBounce(0);
        this.setOrigin(0.5);
        this.setScale(1, 1);
        this.setSize(1, 1);

      this.createPetAnims();

      const{Body, Bodies} = Phaser.Physics.Matter.Matter;
      var petCollider = Bodies.circle(this.x, this.y, 12, {isSensor:false, label:'petCollider'});
      var petSensor = Bodies.circle(this.x,this.y, 70, {isSensor:true, label:'petSensor'});
      const compoundBody = Body.create({
        parts:[petCollider, petSensor],
        frictionAir: 0.35,
      });
      this.setExistingBody(compoundBody);
      this.setFixedRotation();
    //   this.scene.matterCollision.addOnCollideStart({
    //     objectA:[enemySensor],
    //     callback: other=>{if(other.gameObjectB && other.gameObjectB.name =='player'){
    //         //this.attacking=other.gameObjectB;
    //     }
    //    },
    //    context:this.scene,
    //   })
    }
    
    createPetAnims(){
          this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('pet', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1,
          });
          this.anims.create({
            key: 'moving',
            frames: this.anims.generateFrameNumbers('pet', { start: 14, end: 20 }),
            frameRate: 6,
            repeat: -1,
          });          
       }

    update(player){

        let playerPosition = player.position;
        let direction = playerPosition.subtract(this.position);
        if(direction.length()>24){
            let v = direction.normalize();
            this.setVelocityX(direction.x * this.speed);
            this.setVelocityY(direction.y * this.speed);           
        }

        let isMoving = (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1);
        if(isMoving){
            this.anims.play('moving',true);
        }else{
            this.anims.play('idle',true);
        }
    }
}