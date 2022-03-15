<script setup lang="ts">
import type { BlockState } from '../composables/mine'
import { generateMine, states, updateStates } from '../composables/mine'

const numberColors = [
  'text-transparent', // 0
  'text-blue', // 1
  'text-green', // 2
  'text-red', // 3
  'text-purple', // 4
  'text-teal', // 5
  'text-aqua', // 6
  'text-yellow', // 7
  'text-olive', // 8
]

let mineGenerrated = false

const onClick = (state: BlockState) => {
  if (!mineGenerrated) {
    generateMine(state)
    mineGenerrated = true
  }

  // console.log(state[y][x])
  state.revealed = true
  if (state.mine) alert('Sorry!')
  else updateStates(state)
}

const getBlockClass = (state: BlockState): string => {
  return !state.revealed
    ? 'bg-gray/100'
    : (state.mine ? 'bg-red-500/10' : numberColors[state.adjacentMine])
}
</script>

<template>
  <div>
    Minesweeper
    <div v-for="(row, y) in states" :key="y" flex="~" items-center justify-center>
      <button
        v-for="(s, x) in row"
        :key="x"
        w-10
        hover="bg-gray/50"
        h-10
        border="1 gray-400/10"
        flex="~"
        items-center
        justify-center
        m="0.2"
        :class="getBlockClass(s)"
        @click="onClick(s)"
      >
        <template v-if="s.revealed">
          <div v-if="s.mine" i-mdi-bomb />
          <div v-else>
            {{ s.adjacentMine }}
          </div>
        </template>
      </button>
    </div>
  </div>
</template>
