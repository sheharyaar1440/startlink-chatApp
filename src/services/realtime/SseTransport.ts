import type { RealtimeTransport } from './transport';
import type { ChatMessage, RealtimeStatus } from '../../types';

export class SseTransport implements RealtimeTransport {
  private eventSource: EventSource | null = null;
  private messageCallback: ((msg: ChatMessage) => void) | null = null;
  private statusCallback: ((status: RealtimeStatus) => void) | null = null;

  connect(params: { consigneeId: number; lastSeenAt?: string }): void {
    const sseUrl = import.meta.env.VITE_SSE_URL || 'http://localhost:5000/sse';
    const url = `${sseUrl}?consigneeId=${params.consigneeId}${
      params.lastSeenAt ? `&lastSeenAt=${params.lastSeenAt}` : ''
    }`;

    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('SSE connected');
      if (this.statusCallback) {
        this.statusCallback('connected');
      }
    };

    this.eventSource.addEventListener('message', (event) => {
      try {
        const message: ChatMessage = JSON.parse(event.data);
        if (this.messageCallback) {
          this.messageCallback(message);
        }
      } catch (error) {
        console.error('SSE message parse error:', error);
      }
    });

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      if (this.statusCallback) {
        this.statusCallback('error');
      }
    };
  }

  onMessage(cb: (msg: ChatMessage) => void): void {
    this.messageCallback = cb;
  }

  onStatus(cb: (status: RealtimeStatus) => void): void {
    this.statusCallback = cb;
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.statusCallback) {
      this.statusCallback('disconnected');
    }
  }
}
