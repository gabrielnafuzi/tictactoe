import { Board } from '@/components/board'

export default function RoomPage() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center px-4">
      <section className="max-w-lg">
        <Board />
      </section>
    </main>
  )
}
