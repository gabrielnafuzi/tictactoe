import { type SquareValue } from './types'

export const boardValues: Record<
  NonNullable<SquareValue>,
  NonNullable<SquareValue>
> = {
  X: 'X',
  O: 'O',
} as const
