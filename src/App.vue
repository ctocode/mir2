<script setup lang="ts">
import "./index.css";

import { reactive, ref, onMounted } from "vue";
import { getInfo, getMonsterInfo,getItem } from "./api/mock.js";
;
import { useLogStore } from './stores/log.js'
import {Group,Character,Monster} from './common/character'
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

  flightInit();
});



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
  },[])
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
