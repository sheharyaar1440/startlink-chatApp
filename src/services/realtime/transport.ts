import type { ChatMessage, RealtimeStatus } from '../../types';

export interface RealtimeTransport {
  connect(params: { consigneeId: number | string; lastSeenAt?: string }): void;
  onMessage(cb: (msg: ChatMessage) => void): void;
  onStatus?(cb: (status: RealtimeStatus) => void): void;
  disconnect(): void;
}
