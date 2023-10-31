import lvdaoshi from './data/lv-daoshi.json';
import monster from './data/monster.json'
import item from './data/item.json';


//这部分js模仿服务端交互

export function getInfo(lv){
    return lvdaoshi.find((t)=>t.Level===lv)
}

export function getMonsterInfo(id){
    return monster.find((t)=>t.ID===id)
}


export function getItem(id){
    return item.find((t)=>t.ID===id)
}