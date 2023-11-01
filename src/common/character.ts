import { random } from "lodash"
interface CharacterAttr {
    level: number;
    ac: number;
    dc1: number;
    dc2: number;
    hp: number;
    mac: number;
    mc1: number;
    mc2: number;
    mp: number;
    sc1: number;
    sc2: number;
  }
  
  const CDinterval=10
  //战斗时对象
  export class Character {
    isLive: boolean;
    attr: CharacterAttr;
    _realHp = 100;
    set realHp(hp: any) {
      // console.log(this.id+"血量变化", hp);
      if (this._realHp <= 0) {
        this.isLive = false;
      } else {
        this._realHp = hp;
      }
    }
    get realHp() {
      return this._realHp;
    }
    id: string;
    attackTarget: any;
    enemys: any;
    skill: any;
    interval: number;
    intervalIndex: number;
    constructor(id: string, attr: CharacterAttr,skill:any) {
      console.log(id);
      this.id = id;
      // let {level,ac,mac,dc1,dc2,hp,mc1,mc2,mp,sc1,sc2}=attr
      this.isLive = true;
      this.realHp = attr.hp;
      this.attr = attr;
      this.skill=skill
      //设计行动间隔
      this.interval = 100;
      this.intervalIndex = 10;
    }
    damage(wg: number, mg: number) {
      //最好传入acd和mcd 通过防御来
      let damageHp = 0;
      damageHp = wg - this.attr.ac + (mg - this.attr.mac);
      if (damageHp <= 0) {
        damageHp = 0;
      }
      this.realHp = this.realHp - damageHp;
    }
    setBuff() {}
    action(time) {
      if (this.intervalIndex == 0) {
        this.intervalIndex = this.interval;
  
        //buff检查
        this.findEnemy();
      } else {
        this.intervalIndex = this.intervalIndex - 1;
      }
  
      //每秒-1，时间减完以后开始战斗逻辑
      //每秒更新buff状态
      //每秒根据buff更改基础状态
    }
    setEnemys(enemys: any) {
      if (enemys instanceof Group) {
        this.enemys = enemys.characters;
      } else {
        this.enemys = enemys;
      }
    }
    //根据策略检索敌人
    findEnemy() {
      this.findSkill();
       //如果是aoe，则选取多个目标
      if (this.enemys != undefined) {
        this.enemys.forEach((item:Character, index:number) => {
          if (item.isLive === true) {
            this.attackTarget = this.enemys[index];
            return;
          }
        });
  
        this.battle();
      } else {
        // addLog("没有敌人");
      }
    }
    findSkill() {
      //检索技能,如果是buff就是使用buff，并且结束这次行动，否则计算伤害后对敌方造成伤害
    }
    useSkill() {}
    battle() {
      // console.log(this.attackTarget)
      //使用技能
      //计算伤害
      this.attackTarget.damage(random(this.attr.dc1, this.attr.dc2), 0);
    }
  }
  export class Monster extends Character {
    constructor(id: string, attr: CharacterAttr) {
      super(id, attr);
      console.log(id);
    }
  }
  export class Group {
    characters: Array<Character>;
    constructor(cs: Array<Character>) {
      this.characters = cs;
    }
    addCharaceter(c: Character) {
      this.characters.push(c);
    }
    setEnemys(em: any) {
      this.characters.forEach((t) => {
        t.setEnemys(em);
      });
    }
    action(index: number) {
      this.characters.forEach((t) => {
        t.action(index);
      });
    }
  
    isAllDead() {
      let isdead = true;
      this.characters.forEach((t) => {
        if (t.isLive) {
          isdead = false;
        }
      });
      return isdead;
    }
  }