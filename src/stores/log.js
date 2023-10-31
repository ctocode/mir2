// stores/counter.js
import { defineStore } from 'pinia'

export const useLogStore = defineStore('log', {
  state: () => {
    return { list:[{}]  }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    add(type,msg) {
        this.list.push({
            type,
            msg
        })
    },
  },
})