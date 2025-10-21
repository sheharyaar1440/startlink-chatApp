import type { RealtimeTransport } from './transport';
import type { ChatMessage, RealtimeStatus } from '../../types';

export class WebSocketTransport implements RealtimeTransport {
  private ws: WebSocket | null = null;
  private messageCallback: ((msg: ChatMessage) => void) | null = null;
  private statusCallback: ((status: RealtimeStatus) => void) | null = null;

  connect(params: { consigneeId: number; lastSeenAt?: string }): void {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/realtime';

    // Create WebSocket connection
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      if (this.statusCallback) {
        this.statusCallback('connected');
      }

      // Send subscription message
      this.ws?.send(
        JSON.stringify({
          type: 'subscribe',
          consigneeId: params.consigneeId,
          lastSeenAt: params.lastSeenAt,
        })
      );
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message' && this.messageCallback) {
          this.messageCallback(data.payload);
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (this.statusCallback) {
        this.statusCallback('error');
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      if (this.statusCallback) {
        this.statusCallback('disconnected');
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
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
