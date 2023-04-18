/* eslint-disable no-restricted-imports */
import { twMerge } from 'tailwind-merge'

export const cn = (...classList: Parameters<typeof twMerge>) =>
  twMerge(classList)
