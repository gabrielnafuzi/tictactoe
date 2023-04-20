export const CHANNELS = {
  roomId: (roomId: string) => `room-${roomId}`,
} as const

export const EVENTS = {
  roomUpdate: 'room-update',
  roomStarted: 'room-started',
  secondPlayerJoined: 'room-second-player-joined',
  pusherSubscriptionSucceeded: 'pusher:subscription_succeeded',
} as const
