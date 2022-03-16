<template>
  <button
    w-10
    hover="bg-gray/50"
    h-10
    border="1 gray-400/10"
    flex="~"
    items-center
    justify-center
    m="0.2"
    :class="getBlockClass()"
    @click="onClick()"
    @contextmenu.prevent="onRightClick()"
  >
    <template v-if="props.state.revealed || props.isDev">
      <div v-if="props.state.mine" i-mdi-bomb />
      <div v-else>
        {{ props.state.adjacentMine }}
      </div>
    </template>
    <template v-else>
      <div v-if="props.state.flag" i-mdi-flag-triangle text-red />
    </template>
  </button>
</template>

<script setup lang="ts">
import type { BlockState } from '~/types'

const props = defineProps<{ state: BlockState; isDev: boolean }>()

const emit = defineEmits(['onClick', 'onRightClick'])

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

const getBlockClass = (): string => {
  return (!props.isDev && !props.state.revealed)
    ? 'bg-gray/100'
    : (props.state.mine ? 'bg-red-500/50' : numberColors[props.state.adjacentMine])
}

const onClick = () => {
  emit('onClick', props.state)
}

const onRightClick = () => {
  emit('onRightClick', props.state)
}
</script>
