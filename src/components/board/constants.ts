import { CircleSvg, CrossSvg } from './icons'

export const values = {
  X: 'X',
  O: 'O',
} as const

export const icons = {
  [values.X]: CrossSvg,
  [values.O]: CircleSvg,
} as const

export type SquareValue = (typeof values)[keyof typeof values]
