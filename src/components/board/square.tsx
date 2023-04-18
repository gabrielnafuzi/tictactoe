'use client'

import { motion } from 'framer-motion'

import { cn } from '@/utils/cn'

import { values, type SquareValue, icons } from './constants'
import { useBoardContext } from './context'
import { CircleSvg, CrossSvg } from './icons'

type SquareProps = {
  value: SquareValue | null
  onSquareClick?: () => void
  isWinner?: boolean
  index: number
}

const shuffle = <T,>(array: T[]) => array.sort(() => Math.random() - 0.5)
const delays = shuffle([0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.45, 0.5])

const IconPlaceholder = () => {
  const { currentPlayer } = useBoardContext()

  return (
    <div
      className={cn(
        'opacity-0 transition-opacity duration-200 group-hover:opacity-10',
        currentPlayer === values.X ? 'text-teal-400' : 'text-amber-400'
      )}
    >
      {currentPlayer === values.O ? (
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
}: SquareProps) => {
  const Icon = value ? icons[value] : IconPlaceholder

  return (
    <motion.button
      className={cn(
        'group flex min-h-[100px] w-full max-w-[96px] items-center justify-center rounded-xl border-none bg-slate-700 p-6 shadow-[0px_8px] shadow-slate-900 transition-colors active:translate-y-1 active:shadow-[0px_4px] active:shadow-slate-900 sm:max-w-[140px] sm:p-8',
        value &&
          'cursor-not-allowed active:translate-y-0 active:shadow-[0px_8px]',
        value === values.X && 'text-teal-400',
        value === values.O && 'text-amber-400',
        isWinner && 'text-slate-700',
        isWinner && value === values.X && 'bg-teal-400',
        isWinner && value === values.O && 'bg-amber-400'
      )}
      onClick={onSquareClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delays[index], duration: 0.2 }}
    >
      <Icon />
    </motion.button>
  )
}
