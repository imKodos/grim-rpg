import MatterEntity from "./MatterEntity";

export default class Enemy extends MatterEntity{

    static preload(scene){
        scene.load.atlas('enemies', 'assets/characters/enemies.png', 'assets/characters/enemies_atlas.json');
        scene.load.animation('enemies_anim','assets/characters/enemies_anim.json');

        scene.load.audio('bear', 'assets/audio/bear.mp3');
        scene.load.audio('ent', 'assets/audio/ent.mp3');
        scene.load.audio('wolf', 'assets/audio/wolf.mp3');
    }

    constructor(data){
      let {scene, enemy} = data;
      let drops = JSON.parse(enemy.properties.find(p=>p.name=='drops').value);
      let health = enemy.properties.find(p=>p.name=='health').value;
      super({scene, x:enemy.x, y:enemy.y,texture:'enemies', frame:`${enemy.name}_idle_1`,drops,health,name:enemy.name});

      const{Body, Bodies} = Phaser.Physics.Matter.Matter;
      var enemyCollider = Bodies.circle(this.x, this.y, 12, {isSensor:false, label:'enemyCollider'});
      var enemySensor = Bodies.circle(this.x,this.y, 70, {isSensor:true, label:'enemySensor'});
      const compoundBody = Body.create({
        parts:[enemyCollider, enemySensor],
        frictionAir: 0.35,
      });
      this.setExistingBody(compoundBody);
      this.setFixedRotation();
      this.scene.matterCollision.addOnCollideStart({
        objectA:[enemySensor],
        callback: other=>{if(other.gameObjectB && other.gameObjectB.name =='player'){
            this.attacking=other.gameObjectB;
        }
       },
       context:this.scene,
      })
    }

    attack = (target) => {
        if(target.dead || this.dead){
            clearInterval(this.attackTimer);
            return;
        }
        target.hit();
    }

    update(){
        if(this.dead){
            return;
        }
        if(this.attacking){
            let player = this.attacking.position;
            let direction = player.subtract(this.position);
            if(direction.length()>24){
                let v = direction.normalize();
                this.setVelocityX(direction.x);
                this.setVelocityY(direction.y);
                if(this.attackTimer){
                    clearInterval(this.attackTimer);
                    this.attackTimer=null;
                }
            } else{
                if(this.attackTimer == null){
                    this.attackTimer=setInterval(this.attack,500,this.attacking); //calls this.attack method every 500ms with the this.attacking parameter
                }
            }
        }
        this.setFlipX(this.velocity.x<0);
        let isMoving = (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1);
        if(isMoving){
            this.anims.play(`${this.name}_walk`,true);
        }else{
            this.anims.play(`${this.name}_idle`,true);
        }
    }
}