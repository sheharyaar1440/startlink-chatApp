import apiClient from './apiClient';
import type { Consignee, ChatMessage } from '../../types';

export const chatService = {
  getConsignees: async (): Promise<Consignee[]> => {
    const response = await apiClient.get<Consignee[]>('/consignees');
    return response.data;
  },

  getMessages: async (consigneeId: number | string): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ChatMessage[]>('/chats', {
      params: { consigneeId },
    });
    return response.data;
  },

  getNewMessages: async (
    consigneeId: number | string,
    since?: string
  ): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ChatMessage[]>('/chats', {
      params: { consigneeId, timestamp_gte: since },
    });
    return response.data;
  },

  sendMessage: async (message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> => {
    const response = await apiClient.post<ChatMessage>('/chats', message);
    return response.data;
  },

  updateConsigneeStatus: async (
    consigneeId: number,
    status: 'open' | 'closed'
  ): Promise<Consignee> => {
    const response = await apiClient.patch<Consignee>(
      `/consignees/${consigneeId}`,
      { chatStatus: status }
    );
    return response.data;
  },
};
