import type { Ref } from 'vue'
import type { BlockState } from '~/types'

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

type GameStatus = 'play' | 'win' | 'lost'

interface MineGame {
  mineGenerrated: boolean
  broad: BlockState[][]
  gameStatus: GameStatus
}

export class GamePlay {
  game = ref() as Ref<MineGame>

  constructor(public height: number, public width: number, public totalMineNUmber: number) {
    this.resetMines()
  }

  get broad() {
    return this.game.value.broad
  }

  get mineGenerrated() {
    return this.game.value.mineGenerrated
  }

  get gameStatus() {
    return this.game.value.gameStatus
  }

  private calculateMineNumber = (): number => {
    let count = 0
    this.broad.forEach((line) => {
      line.forEach((st) => {
        if (st.mine) count++
      })
    })
    return count
  }

  private calculateLeftMineNumber = (s: BlockState): number => {
    return (this.height - s.x - 1) * this.width + this.width - s.y - 1
  }

  private calculateAdjacentMine = (): void => {
    this.broad.forEach((line, _) => {
      line.forEach((st, _) => {
        let count = 0
        this.getSiblings(st).forEach((sibling) => {
          if (sibling.mine) count++
        })
        st.adjacentMine = count
      })
    })
  }

  private revealAround = (s: BlockState): void => {
    // console.log('rev', s.x, s.y)
    this.getSiblings(s).forEach((sibling) => {
      if (!sibling.flag && !sibling.revealed) {
        sibling.revealed = true
        if (sibling.adjacentMine === 0) this.revealAround(sibling)
      }
    })
  }

  private getSiblings = (st: BlockState) => {
    return DIRECTIONS.map(([dx, dy]) => {
      const targetX = st.x + dx
      const targetY = st.y + dy
      if (targetX < 0 || targetY < 0 || targetX >= this.height || targetY >= this.width)
        return undefined
      return this.broad[targetX][targetY]
    }).filter(Boolean) as BlockState[]
  }

  showAllMines = () => {
    for (const line of this.broad) {
      for (const s of line)
        if (s.mine) s.revealed = true
    }
  }

  generateMine = (st: BlockState): void => {
    for (const line of this.broad) {
      for (const s of line) {
        const mineNumber = this.calculateMineNumber()
        if (st.x === s.x && st.y === s.y) s.mine = false
        else if (mineNumber >= this.totalMineNUmber) s.mine = false
        else if (this.calculateLeftMineNumber(s) <= (this.totalMineNUmber - mineNumber)) s.mine = true
        else s.mine = Math.random() < 0.2
      }
    }
    this.calculateAdjacentMine()
  }

  updateStates = (s: BlockState): void => {
    this.broad[s.x][s.y].revealed = true
    if (this.broad[s.x][s.y].adjacentMine === 0) this.revealAround(s)
  }

  updateFlag = (s: BlockState): void => {
    this.getSiblings(s).forEach((sibling) => {
      if (sibling.revealed && sibling.adjacentMine === 0) s.revealed = true
    })
  }

  checkStatus = (): void => {
    if (!this.mineGenerrated) return
    let status = true
    for (const line of this.broad) {
      for (const s of line) {
        if ((s.mine && !s.flag) || (!s.mine && s.flag) || (!s.revealed && !s.mine)) status = false
        if (s.mine && s.revealed) {
          this.showAllMines()
          this.game.value.gameStatus = 'lost'
        }
      }
    }
    if (status) this.game.value.gameStatus = 'win'
  }

  resetMines = () => {
    this.game.value = {
      gameStatus: 'play',
      mineGenerrated: false,
      broad: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width }, (_, x): BlockState => {
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
    }
  }
}
