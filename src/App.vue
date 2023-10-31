<script setup lang="ts">
import "./index.css";

import { reactive, ref, onMounted } from "vue";
import { getInfo, getMonsterInfo,getItem } from "./api/mock.js";
import { random } from "lodash";
import { useLogStore } from './stores/log.js'
let item = {
  tx1: {
    type: "", //药水/装备
  },
};

let logstore=useLogStore()


function addLog(str) {
  logstore.add("1",str)
}

let map = {
  test1: {
    monsters: ["100001", "100002"],
    item: ["201001"],
  },
};

let bag = reactive([{}]);

let info = ref("");

function safeNumber(num: any) {
  return num + 0;
}

onMounted(() => {
  let c = getInfo("10");
  let m = getMonsterInfo("100002");
  console.log(c, map["test1"]);

  flightInit(c, m);
});

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
class Character {
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
    this.interval = 10;
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

    if (this.enemys != undefined) {
      this.enemys.forEach((item, index) => {
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
class Monster extends Character {
  constructor(id: string, attr: CharacterAttr) {
    super(id, attr);
    console.log(id);
  }
}
class Group {
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

const character = reactive(
  new Character("1", {
    level: 1,
    ac: 2,
    dc1: 3,
    dc2: 200,
    hp: 500,
    mac: 6,
    mc1: 7,
    mc2: 8,
    mp: 9,
    sc1: 1,
    sc2: 1,
  })
);

const monster: any = reactive(new Group([]));

character.setEnemys(monster);

monster.setEnemys([character]);

let i = 0;
function battle(timestamp) {
  i++;
  // character.realHp=i
  // console.log(i);
  //两边队伍出现死亡则结束
  if (monster.isAllDead() === true || character.isLive === false) {
    console.log("战斗结束");
    //进入掉落环节
    bag.push(getItem("201001"))

  } else {
    requestAnimationFrame(battle);
    character.action(i);
    monster.action(i);
  }

  // monster.action(i)
}

// function ourTeamFightEnemyTeam(){}

function flightInit() {
  if (character.isLive === false) {
    //人物死亡，请复活
  }

  let monsterQuantity = random(1, 5);
  //find map
  //find monster

  for (let index = 0; index < monsterQuantity; index++) {
    console.log(index);
    monster.addCharaceter(
      new Monster("100" + index, {
        level: 1,
        ac: 2,
        dc1: 2,
        dc2: 10,
        hp: 5000,
        mac: 6,
        mc1: 7,
        mc2: 8,
        mp: 9,
        sc1: 1,
        sc2: 1,
      })
    );
  }

  requestAnimationFrame(battle);
  // let fightEnd = false;
  //实例化我方队伍，使用对象
  //实例化敌方队伍
  // let ourTeam = [];
  // ourTeam.push(c);
  // let enemyTeam = [];
  // enemyTeam.push(m);
  //实例化系统时钟,默认最小单位为0.1秒，战斗持续最长为1000秒,使用requestAnimationFrame解决

  //我方队伍开始检索敌方队伍
  //敌方队伍开始检索我方队伍
  //战斗检测与打印
  //战斗结束
  //开启掉落

  //回避 mon.dodge = mon.level / 5;
  //怪物回血=等级/5
  // console.log(c, m);
}




</script>

<template>
  <div>
    {{logstore.list}}
    <button @click="flightInit">开始</button>
    {{counter}}
    包裹 {{ bag }}

    怪物{{ monster }} ———————————————————————— 人物：{{ character }}
    —————————————————————————
    <!-- {{log}} -->
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
