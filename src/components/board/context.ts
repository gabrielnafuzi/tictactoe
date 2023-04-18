import { createContext, useContext } from 'react'

import { type SquareValue } from './constants'

type BoardContextValues = {
  currentPlayer: SquareValue
}

const BoardContext = createContext<BoardContextValues>({} as BoardContextValues)

export const BoardProvider = BoardContext.Provider

export const useBoardContext = () => {
  const context = useContext(BoardContext)

  if (!context) {
    throw new Error('useBoardContext must be used within a BoardContext')
  }

  return context
}
