const TOTAL_MINE_NUMBER = 10
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

export const states = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
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
  ),
)

export interface BlockState {
  revealed: boolean
  mine: boolean
  flag: boolean
  adjacentMine: number
  x: number
  y: number
  defaultDisplay: string
}

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
    if (!sibling.revealed) {
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
    return states[targetX][targetY]
  }).filter(Boolean) as BlockState[]
}

export const generateMine = (st: BlockState): void => {
  for (const line of states) {
    for (const s of line) {
      const mineNumber = calculateMineNumber(states)
      if (st.x === s.x && st.y === s.y) s.mine = false
      else if (mineNumber >= TOTAL_MINE_NUMBER) s.mine = false
      else if (calculateLeftMineNumber(s.x, s.y) <= (TOTAL_MINE_NUMBER - mineNumber)) s.mine = true
      else s.mine = Math.random() < 0.2
    }
  }
  calculateAdjacentMine(states)
}

export const updateStates = (s: BlockState): void => {
  states[s.x][s.y].revealed = true
  if (states[s.x][s.y].adjacentMine === 0) revealAround(s)
}
