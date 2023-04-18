'use client'

import { motion } from 'framer-motion'

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (index: number) => {
    const delay = index * 0.5

    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: 'spring', bounce: 0 },
        opacity: { delay, duration: 0.01 },
      },
    }
  },
}

type IconProps = {
  isAnimated?: boolean
}

export const CircleSvg = ({ isAnimated = true }: IconProps) => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 52 52"
      initial={isAnimated ? 'hidden' : 'visible'}
      animate="visible"
    >
      <motion.circle
        stroke="currentColor"
        variants={draw}
        custom={0.2}
        strokeWidth="8"
        strokeLinecap="round"
        cx="26"
        cy="26"
        r="20"
        fill="none"
      />
    </motion.svg>
  )
}

export const CrossSvg = ({ isAnimated = true }: IconProps) => {
  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={isAnimated ? 'hidden' : 'visible'}
      animate="visible"
    >
      <motion.line
        stroke="currentColor"
        variants={draw}
        custom={0}
        strokeWidth="8"
        strokeLinecap="round"
        x1="6"
        y1="6"
        x2="46"
        y2="46"
      />

      <motion.line
        stroke="currentColor"
        variants={draw}
        custom={0.3}
        strokeWidth="8"
        strokeLinecap="round"
        x1="46"
        y1="6"
        x2="6"
        y2="46"
      />
    </motion.svg>
  )
}
