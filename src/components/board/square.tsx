'use client'

import { motion } from 'framer-motion'

import { boardValues } from '@/constants'
import { type SquareValue } from '@/types'
import { cn } from '@/utils/cn'

import { icons } from './constants'
import { useBoardContext } from './context'
import { CircleSvg, CrossSvg } from './icons'

type SquareProps = {
  value: SquareValue
  onSquareClick?: () => void
  isWinner?: boolean
  index: number
  disabled?: boolean
}

const shuffle = <T,>(array: Array<T>) => array.sort(() => Math.random() - 0.5)
const delays = shuffle([0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21, 0.24])

const IconPlaceholder = () => {
  const { currentPlayer } = useBoardContext()

  return (
    <div
      className={cn(
        'opacity-0 transition-opacity duration-200 group-hover:opacity-20 group-disabled:group-hover:opacity-0 dark:group-hover:opacity-10',
        currentPlayer === boardValues.X ? 'text-teal-400' : 'text-amber-400'
      )}
    >
      {currentPlayer === boardValues.O ? (
        <CircleSvg isAnimated={false} />
      ) : (
        <CrossSvg isAnimated={false} />
      )}
    </div>
  )
}

export const Square = ({
  value,
  onSquareClick,
  isWinner,
  index,
  disabled = false,
}: SquareProps) => {
  const Icon = value ? icons[value]! : IconPlaceholder

  return (
    <motion.button
      className={cn(
        'group flex min-h-[100px] w-full max-w-[96px] items-center justify-center rounded-xl border-none bg-slate-200 p-6 shadow-[0px_8px] shadow-slate-300 transition-colors active:!translate-y-1 active:shadow-[0px_4px] active:shadow-slate-300 dark:bg-slate-700 dark:shadow-slate-800 dark:active:shadow-slate-800 sm:max-w-[140px] sm:p-8',
        'disabled:cursor-not-allowed disabled:active:!translate-y-0 disabled:active:shadow-[0px_8px] disabled:active:shadow-slate-300 dark:disabled:active:shadow-slate-800',
        value === boardValues.X && 'text-teal-400',
        value === boardValues.O && 'text-amber-400',
        isWinner && 'text-slate-200 dark:text-slate-700',
        isWinner && value === boardValues.X && 'bg-teal-400',
        isWinner && value === boardValues.O && 'bg-amber-400'
      )}
      onClick={onSquareClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delays[index], duration: 0.2 }}
      disabled={disabled || !!value}
    >
      <Icon />
    </motion.button>
  )
}
