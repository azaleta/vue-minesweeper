<script setup lang="ts">

import MineBlock from '../components/MineBlock.vue'
import type { BlockState } from '~/types'
import { GamePlay } from '~/composables/logic'

const gm = new GamePlay(10, 10, 2)
useStorage('vue-minesweep', gm.game)

const isDev = ref(false)

const resetMine = () => {
  gm.resetMines()
  gm.game.value.mineGenerrated = false
  isDev.value = false
}

const onClick = (state: BlockState) => {
  if (gm.gameStatus !== 'play') return
  if (!gm.mineGenerrated) {
    gm.generateMine(state)
    gm.game.value.mineGenerrated = true
  }

  // console.log(state[y][x])
  if (state.flag) return
  state.revealed = true
  if (state.mine) gm.checkStatus()
  else gm.updateStates(state)
}

const onRightClick = (state: BlockState) => {
  if (gm.gameStatus !== 'play') return
  if (!state.revealed) {
    state.flag = !state.flag
    if (!state.flag) gm.updateFlag(state)
  }
}

const toggleDev = () => {
  isDev.value = !isDev.value
}

// watchEffect(() => {
//   if (!gm.mineGenerrated.value) return
//   if (gm.checkStatus()) alert('Win')
// }, {
//   onTrack(e) {
//   },
//   onTrigger(e) {
//   },
// })

watchEffect(gm.checkStatus)

</script>

<template>
  <div>
    Minesweeper
    <div v-if="gm.gameStatus !== 'play'">
      {{ gm.gameStatus }}
    </div>
    <div v-for="(row, y) in gm.broad" :key="y" flex="~" items-center justify-center>
      <MineBlock
        v-for="(s, x) in row"
        :key="x"
        :state="s"
        :is-dev="isDev"
        @on-click="onClick(s)"
        @on-right-click="onRightClick(s)"
      />
    </div>
    <div flex="~ gap-1" justify-center p-3>
      <button btn @click="resetMine">
        Reset
      </button>
      <button btn :disabled="!gm.mineGenerrated || gm.gameStatus !== 'play'" @click="toggleDev">
        {{ isDev ? 'Normal': 'Hacker' }}
      </button>
    </div>
  </div>
</template>
