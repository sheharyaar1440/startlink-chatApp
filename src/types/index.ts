export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
}

export interface Consignee {
  id: number | string;
  name: string;
  phone: string;
  chatStatus: 'open' | 'closed';
  lastMessage: string;
  isGenAI?: boolean;
}

export interface ChatMessage {
  id: number | string;
  consigneeId: number | string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: string;
  isGenAI: boolean;
}

export type ChatStatus = 'open' | 'closed' | 'all';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export type RealtimeStatus = 'connected' | 'disconnected' | 'error';

export type RealtimeTransportType = 'polling' | 'ws' | 'sse';

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface AuthSession {
  user: Omit<User, 'password'>;
  token: string;
}
