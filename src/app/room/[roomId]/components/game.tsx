'use client'

import { useEffect, useState, useTransition } from 'react'

import { type RoomGameState } from '@prisma/client'
import { useRouter } from 'next/navigation'
import ReactConfetti from 'react-confetti'

import { Board } from '@/components/board'
import { clientPusher } from '@/lib/pusher/client'
import { type SquareValue } from '@/types'
import { cn } from '@/utils/cn'

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
  const [, startTransition] = useTransition()

  const [currentPlayer, setCurrentPlayer] = useState<SquareValue>(
    gameState.nextTurn
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

    fetch(`/api/rooms/${gameState.roomId}/update-game-state`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board: newSquares,
        nextTurn: value,
        winner: null,
      }),
    })
  }

  const handleOnWin = (winner: SquareValue) => {
    if (winner === currentUserBoardValue) {
      setShowConfetti(true)
    }
  }

  useEffect(() => {
    const channel = clientPusher.subscribe(`room-${gameState.roomId}`)

    channel.bind('game-update', (data: RoomGameState) => {
      setCurrentPlayer(data.nextTurn)
      setSquares(data.board as Array<SquareValue | null>)

      if (data.winner) {
        startTransition(() => {
          router.refresh()
        })
      }
    })

    return () => {
      channel.unsubscribe()
      channel.unbind_all()
    }
  }, [gameState.roomId, router])

  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [showConfetti])

  return (
    <section className={cn('max-w-lg', isWatching && 'pointer-events-none')}>
      <Board
        currentPlayer={currentPlayer}
        squares={squares}
        onBoardChange={handleOnBoardChange}
        isCurrentUserTurn={currentPlayer === currentUserBoardValue}
        isWatching={isWatching}
        onWin={handleOnWin}
      />

      {showConfetti && <ReactConfetti />}
    </section>
  )
}
