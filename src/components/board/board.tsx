import { useMemo, useState } from 'react'

import { boardValues } from '@/constants'
import { type SquareValue } from '@/types'
import { calculateWinner } from '@/utils/calculate-winner'
import { cn } from '@/utils/cn'

import { icons } from './constants'
import { BoardProvider, useBoardContext } from './context'
import { Square } from './square'

type WinnerData = {
  winner: SquareValue
  line: [number, number, number]
}

type BoardProps = {
  currentPlayer: SquareValue
  squares: Array<SquareValue>
  onBoardChange: (squares: Array<SquareValue>, nextPlayer: SquareValue) => void
  isCurrentUserTurn: boolean
  isWatching: boolean
  onWin: (winner: SquareValue) => void
}

export const Board = ({
  currentPlayer,
  squares,
  onBoardChange,
  isCurrentUserTurn,
  isWatching,
  onWin,
}: BoardProps) => {
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null)

  const handleClick = (index: number) => {
    if (squares[index] || winnerData) {
      return
    }

    const newSquares = [...squares]
    newSquares[index] = currentPlayer

    const maybeWinnerData = calculateWinner(newSquares)

    if (maybeWinnerData) {
      setWinnerData(maybeWinnerData)

      onWin(maybeWinnerData.winner)
    }

    const nextPlayer =
      currentPlayer === boardValues.X ? boardValues.O : boardValues.X

    onBoardChange(newSquares, nextPlayer)
  }

  const value = useMemo(() => ({ currentPlayer }), [currentPlayer])

  return (
    <BoardProvider value={value}>
      <div className="flex flex-col items-center gap-6">
        <TurnIndicator />

        <div className="grid grid-cols-3 gap-4">
          {squares.map((value, index) => (
            <Square
              key={index}
              value={value}
              onSquareClick={() => handleClick(index)}
              isWinner={winnerData?.line.includes(index)}
              index={index}
              disabled={
                !isCurrentUserTurn || isWatching || !!winnerData?.winner
              }
            />
          ))}
        </div>
      </div>
    </BoardProvider>
  )
}

const TurnIndicator = () => {
  const { currentPlayer } = useBoardContext()

  const Icon = icons[currentPlayer as keyof typeof icons]!

  return (
    <div className="flex w-28 items-center justify-center rounded-lg border-none bg-slate-200 p-2 shadow-[0px_4px] shadow-slate-300 transition-colors dark:bg-slate-700 dark:shadow-slate-800">
      <div
        className={cn(
          'h-4 w-4',
          currentPlayer === boardValues.X ? 'text-teal-400' : 'text-amber-400'
        )}
      >
        <Icon />
      </div>

      <span className="ml-2 text-sm font-bold uppercase text-slate-900 dark:text-slate-100">
        Turn
      </span>
    </div>
  )
}
