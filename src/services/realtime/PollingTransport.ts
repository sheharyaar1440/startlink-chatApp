import type { RealtimeTransport } from './transport';
import type { ChatMessage, RealtimeStatus } from '../../types';
import { chatService } from '../api/chatService';

export class PollingTransport implements RealtimeTransport {
  private consigneeId: number | string | null = null;
  private lastTimestamp: string | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private messageCallback: ((msg: ChatMessage) => void) | null = null;
  private statusCallback: ((status: RealtimeStatus) => void) | null = null;
  private seenMessageIds = new Set<number | string>();
  private pollInterval = 3000; // 3 seconds

  connect(params: { consigneeId: number | string; lastSeenAt?: string }): void {
    this.consigneeId = params.consigneeId;
    this.lastTimestamp = params.lastSeenAt || null;
    this.seenMessageIds.clear();

    if (this.statusCallback) {
      this.statusCallback('connected');
    }

    this.startPolling();
  }

  private startPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(async () => {
      if (!this.consigneeId) return;

      try {
        const messages = await chatService.getNewMessages(
          this.consigneeId,
          this.lastTimestamp || undefined
        );

        // Filter out already seen messages and deduplicate
        const newMessages = messages.filter(
          (msg) => !this.seenMessageIds.has(msg.id)
        );

        newMessages.forEach((msg) => {
          this.seenMessageIds.add(msg.id);
          if (this.messageCallback) {
            this.messageCallback(msg);
          }
        });

        // Update last timestamp
        if (messages.length > 0) {
          const latestMessage = messages[messages.length - 1];
          this.lastTimestamp = latestMessage.timestamp;
        }
      } catch (error) {
        console.error('Polling error:', error);
        if (this.statusCallback) {
          this.statusCallback('error');
        }
      }
    }, this.pollInterval);
  }

  onMessage(cb: (msg: ChatMessage) => void): void {
    this.messageCallback = cb;
  }

  onStatus(cb: (status: RealtimeStatus) => void): void {
    this.statusCallback = cb;
  }

  disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.consigneeId = null;
    this.lastTimestamp = null;
    this.seenMessageIds.clear();
    if (this.statusCallback) {
      this.statusCallback('disconnected');
    }
  }
}
