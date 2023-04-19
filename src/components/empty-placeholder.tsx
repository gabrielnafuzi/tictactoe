import { type SVGProps, type HTMLAttributes } from 'react'

import { Icons } from '@/components/icons'
import { cn } from '@/utils/cn'

type EmptyPlaceholderProps = HTMLAttributes<HTMLDivElement>

export function EmptyPlaceholder({
  className,
  children,
  ...props
}: EmptyPlaceholderProps) {
  return (
    <div
      className={cn(
        'animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center',
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}

type EmptyPlaceholderIconProps = {
  name: keyof typeof Icons
} & Partial<SVGProps<SVGSVGElement>>

const EmptyPlaceHolderIcon = ({
  name,
  className,
  ...props
}: EmptyPlaceholderIconProps) => {
  const Icon = Icons[name]

  if (!Icon) {
    return null
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
      <Icon className={cn('h-10 w-10', className)} {...props} />
    </div>
  )
}

EmptyPlaceholder.Icon = EmptyPlaceHolderIcon

type EmptyPlaceholderTitleProps = HTMLAttributes<HTMLHeadingElement>

const EmptyPlaceholderTitle = ({
  className,
  ...props
}: EmptyPlaceholderTitleProps) => {
  return (
    <h2 className={cn('mt-6 text-xl font-semibold', className)} {...props} />
  )
}

EmptyPlaceholder.Title = EmptyPlaceholderTitle

type EmptyPlaceholderDescriptionProps = HTMLAttributes<HTMLParagraphElement>

const EmptyPlaceholderDescription = ({
  className,
  ...props
}: EmptyPlaceholderDescriptionProps) => {
  return (
    <p
      className={cn(
        'mb-8 mt-3 text-center text-sm font-normal leading-6 text-slate-700 dark:text-slate-200',
        className
      )}
      {...props}
    />
  )
}

EmptyPlaceholder.Description = EmptyPlaceholderDescription
