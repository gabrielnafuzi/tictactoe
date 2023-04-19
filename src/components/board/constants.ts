import { boardValues } from '@/constants'

import { CircleSvg, CrossSvg } from './icons'

export const icons = {
  [boardValues.X]: CrossSvg,
  [boardValues.O]: CircleSvg,
} as const
