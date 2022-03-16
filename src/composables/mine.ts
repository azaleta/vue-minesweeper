import type { BlockState } from '~/types'

const TOTAL_MINE_NUMBER = 2
const HEIGHT = 10
const WIDTH = 10

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export const mineGenerrated = ref(false)

export const states = ref<BlockState[][]>([],
)

const calculateMineNumber = (state: BlockState[][]): number => {
  let count = 0
  state.forEach((line, _) => {
    line.forEach((st, _) => {
      if (st.mine) count++
    })
  })
  return count
}

const calculateLeftMineNumber = (x: number, y: number): number => {
  return (HEIGHT - x - 1) * WIDTH + WIDTH - y - 1
}

const calculateAdjacentMine = (state: BlockState[][]): void => {
  state.forEach((line, _) => {
    line.forEach((st, _) => {
      let count = 0
      getSiblings(st).forEach((sibling) => {
        if (sibling.mine) count++
      })
      st.adjacentMine = count
    })
  })
}

const revealAround = (s: BlockState): void => {
  // console.log('rev', s.x, s.y)
  getSiblings(s).forEach((sibling) => {
    if (!sibling.flag && !sibling.revealed) {
      sibling.revealed = true
      if (sibling.adjacentMine === 0) revealAround(sibling)
    }
  })
}

function getSiblings(st: BlockState) {
  return DIRECTIONS.map(([dx, dy]) => {
    const targetX = st.x + dx
    const targetY = st.y + dy
    if (targetX < 0 || targetY < 0 || targetX >= HEIGHT || targetY >= WIDTH)
      return undefined
    return states.value[targetX][targetY]
  }).filter(Boolean) as BlockState[]
}

export const generateMine = (st: BlockState): void => {
  for (const line of states.value) {
    for (const s of line) {
      const mineNumber = calculateMineNumber(states.value)
      if (st.x === s.x && st.y === s.y) s.mine = false
      else if (mineNumber >= TOTAL_MINE_NUMBER) s.mine = false
      else if (calculateLeftMineNumber(s.x, s.y) <= (TOTAL_MINE_NUMBER - mineNumber)) s.mine = true
      else s.mine = Math.random() < 0.2
    }
  }
  calculateAdjacentMine(states.value)
}

export const updateStates = (s: BlockState): void => {
  states.value[s.x][s.y].revealed = true
  if (states.value[s.x][s.y].adjacentMine === 0) revealAround(s)
}

export const updateFlag = (s: BlockState): void => {
  getSiblings(s).forEach((sibling) => {
    if (sibling.revealed && sibling.adjacentMine === 0) s.revealed = true
  })
}

export const checkStatus = (): boolean => {
  // console.log(useNow().value)
  for (const line of states.value) {
    for (const s of line)
      if ((s.mine && !s.flag) || (!s.mine && s.flag)) return false
  }
  return true
}

export const resetMines = () => {
  states.value = Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => {
      return {
        revealed: false,
        mine: false,
        flag: false,
        adjacentMine: 0,
        x: y,
        y: x,
        defaultDisplay: '-',
      }
    }),
  )
}
