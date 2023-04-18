'use client'
import { useMemo, useState } from 'react'

import { icons, values, type SquareValue } from './constants'
import { BoardProvider, useBoardContext } from './context'
import { Square } from './square'

type WinnerData = {
  winner: SquareValue
  line: [number, number, number]
}

export const Board = () => {
  const [currentPlayer, setCurrentPlayer] = useState<SquareValue>(values.X)

  const [winnerData, setWinnerData] = useState<{
    winner: SquareValue
    line: [number, number, number]
  } | null>(null)

  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null))

  const handleClick = (index: number) => {
    if (squares[index] || winnerData) {
      return
    }

    const newSquares = [...squares]
    newSquares[index] = currentPlayer

    setSquares(newSquares)

    const newWinnerData = calculateWinner(newSquares)
    setWinnerData(newWinnerData)

    setCurrentPlayer(currentPlayer === values.X ? values.O : values.X)
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
            />
          ))}
        </div>
      </div>
    </BoardProvider>
  )
}

const calculateWinner = (squares: SquareValue[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ] as const

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a]!,
        line: [a, b, c],
      } satisfies WinnerData
    }
  }

  return null
}

const TurnIndicator = () => {
  const { currentPlayer } = useBoardContext()

  const Icon = icons[currentPlayer]

  return (
    <div className="flex w-28 items-center justify-center rounded-lg border-none bg-slate-700 p-2 shadow-[0px_4px] shadow-slate-900 transition-colors">
      <div className="h-4 w-4">
        <Icon />
      </div>

      <span className="ml-2 text-sm font-bold uppercase text-slate-100">
        Turn
      </span>
    </div>
  )
}
