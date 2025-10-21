import type { RealtimeTransport } from './transport';
import { PollingTransport } from './PollingTransport';
import { WebSocketTransport } from './WebSocketTransport';
import { SseTransport } from './SseTransport';

export function createRealtimeTransport(): RealtimeTransport {
  const kind = import.meta.env.VITE_REALTIME_TRANSPORT ?? 'polling';

  switch (kind) {
    case 'ws':
      return new WebSocketTransport();
    case 'sse':
      return new SseTransport();
    default:
      return new PollingTransport();
  }
}

export * from './transport';
