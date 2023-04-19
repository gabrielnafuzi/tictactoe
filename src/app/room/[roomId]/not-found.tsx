import Link from 'next/link'

import { buttonVariants } from '@/components/button'
import { EmptyPlaceholder } from '@/components/empty-placeholder'

export default function NotFound() {
  return (
    <div className="container mx-auto grid items-start gap-10 py-8">
      <EmptyPlaceholder className="mx-auto max-w-[800px]">
        <EmptyPlaceholder.Icon name="Warning" />
        <EmptyPlaceholder.Title>Uh oh! Not Found</EmptyPlaceholder.Title>

        <EmptyPlaceholder.Description>
          This room could not be found. Please try again.
        </EmptyPlaceholder.Description>

        <Link href="/" className={buttonVariants({ variant: 'outline' })}>
          Go to home
        </Link>
      </EmptyPlaceholder>
    </div>
  )
}
