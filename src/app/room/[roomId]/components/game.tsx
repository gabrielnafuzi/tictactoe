'use client'

import { useCallback, useEffect, useState } from 'react'

import { type RoomGameState } from '@prisma/client'
import { useRouter } from 'next/navigation'
import ReactConfetti from 'react-confetti'

import { Board } from '@/components/board'
import { httpClient } from '@/lib/http-client'
import { clientPusher } from '@/lib/pusher/client'
import { CHANNELS, EVENTS } from '@/lib/pusher/constants'
import { type SquareValue } from '@/types'
import { cn } from '@/utils/cn'

export type WinnerData = {
  winner: SquareValue
  line: [number, number, number]
}

type GameProps = {
  gameState: Omit<RoomGameState, 'createdAt' | 'board'> & {
    board: Array<SquareValue | null>
    createdAt: string
  }
  currentUserBoardValue: SquareValue
  isWatching: boolean
}

export const Game = ({
  gameState,
  currentUserBoardValue,
  isWatching,
}: GameProps) => {
  const router = useRouter()

  const [currentPlayer, setCurrentPlayer] = useState<SquareValue>(
    gameState.nextTurn
  )

  const [winnerData, setWinnerData] = useState<WinnerData | null>(
    gameState.winner
      ? {
          line: JSON.parse(gameState.winnerCombination as string) as [
            number,
            number,
            number
          ],
          winner: gameState.winner,
        }
      : null
  )

  const [squares, setSquares] = useState<Array<SquareValue | null>>(
    gameState.board
  )

  const [showConfetti, setShowConfetti] = useState(false)

  const handleOnBoardChange = (
    newSquares: Array<SquareValue | null>,
    value: SquareValue
  ) => {
    setCurrentPlayer(value)
    setSquares(newSquares)

    httpClient.patch(`/api/rooms/${gameState.roomId}/update-game-state`, {
      board: newSquares,
      nextTurn: value,
      winner: null,
    })
  }

  const handleOnWin = (newWinnerData: WinnerData) => {
    setWinnerData(newWinnerData)

    if (newWinnerData.winner === currentUserBoardValue) {
      setShowConfetti(true)
    }
  }

  const handleOnRoomUpdate = useCallback(
    (data: RoomGameState) => {
      const board = data.board as Array<SquareValue | null>
      setCurrentPlayer(data.nextTurn)
      setSquares(board)

      if (data.winner || board.every((square) => square !== null)) {
        setWinnerData(
          data.winner
            ? {
                winner: data.winner,
                line: data.winnerCombination as [number, number, number],
              }
            : null
        )

        if (data.winner === currentUserBoardValue) {
          setTimeout(() => {
            router.refresh()
          }, 3000)

          return
        }

        router.refresh()
      }
    },
    [currentUserBoardValue, router]
  )

  useEffect(() => {
    const channel = clientPusher.subscribe(CHANNELS.roomId(gameState.roomId))

    channel.bind(EVENTS.roomUpdate, handleOnRoomUpdate)

    return () => {
      channel.unsubscribe()
      channel.unbind_all()
    }
  }, [gameState.roomId, handleOnRoomUpdate])

  return (
    <section className={cn('max-w-lg', isWatching && 'pointer-events-none')}>
      <Board
        currentPlayer={currentPlayer}
        squares={squares}
        onBoardChange={handleOnBoardChange}
        isCurrentUserTurn={currentPlayer === currentUserBoardValue}
        isWatching={isWatching}
        onWin={handleOnWin}
        winnerData={winnerData}
      />

      {showConfetti && (
        <ReactConfetti
          width={globalThis.window?.innerWidth}
          height={globalThis.window?.innerHeight}
        />
      )}
    </section>
  )
}
