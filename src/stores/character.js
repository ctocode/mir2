// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('character', {
  state: () => {
    return { char: {

    } ,
    equip:{
        header:"id"

    }
}
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    init() {
      //
    },
  },
})