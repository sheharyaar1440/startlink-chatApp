import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { Consignee, ChatMessage } from '../../types';
import { chatService } from '../../services/api/chatService';
import { createRealtimeTransport } from '../../services/realtime';
import ChatBubble from '../../components/ChatBubble';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../hooks/useToast';
import ReplyBar from './ReplyBar';

interface ChatWindowProps {
  consignee: Consignee;
  onClose?: () => void;
}

// Gen AI responses pool
const genAIResponses = [
  'Thanks for your message! How can I assist you further?',
  'I understand your concern. Let me help you with that.',
  'That\'s a great question! Here\'s what I can tell you...',
  'I\'ve received your request. I\'m processing it now.',
  'Thank you for reaching out! I\'m here to help.',
  'I appreciate your patience. Let me check that for you.',
  'Got it! I\'ll take care of that right away.',
  'Perfect! I can definitely help you with that.',
];

const ChatWindow: React.FC<ChatWindowProps> = ({ consignee, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isGenAITyping, setIsGenAITyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const transportRef = useRef(createRealtimeTransport());
  const genAITimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProcessedMessageIdRef = useRef<number | string | null>(null);
  const { addToast } = useToast();

  const getRandomGenAIResponse = useCallback(() => {
    return genAIResponses[Math.floor(Math.random() * genAIResponses.length)];
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getMessages(consignee.id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
      addToast('Failed to load messages', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [consignee.id, addToast]);

  const triggerGenAIReply = useCallback(() => {
    setIsGenAITyping(true);

    // Random delay between 1.5 to 3 seconds for more natural feel
    const delay = 1500 + Math.random() * 1500;

    genAITimeoutRef.current = setTimeout(async () => {
      try {
        const aiReply: Omit<ChatMessage, 'id'> = {
          consigneeId: consignee.id,
          sender: 'agent',
          message: getRandomGenAIResponse(),
          timestamp: new Date().toISOString(),
          isGenAI: true,
        };

        const aiMessage = await chatService.sendMessage(aiReply);
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error('Gen AI reply failed:', error);
      } finally {
        setIsGenAITyping(false);
      }
    }, delay);
  }, [consignee.id, getRandomGenAIResponse]);

  useEffect(() => {
    loadMessages();

    // Set up realtime transport
    const transport = transportRef.current;

    transport.onMessage((newMessage) => {
      setMessages((prev) => {
        // Check if message already exists
        if (prev.some((m) => m.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
    });

    if (transport.onStatus) {
      transport.onStatus((status) => {
        console.log('Realtime status:', status);
      });
    }

    transport.connect({
      consigneeId: consignee.id,
      lastSeenAt: messages.length > 0 ? messages[messages.length - 1].timestamp : undefined
    });

    return () => {
      transport.disconnect();
      // Cleanup Gen AI timeout on unmount
      if (genAITimeoutRef.current) {
        clearTimeout(genAITimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consignee.id, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Gen AI Auto-Reply Logic
  useEffect(() => {
    if (!consignee.isGenAI || messages.length === 0 || isGenAITyping) {
      return;
    }

    const lastMessage = messages[messages.length - 1];

    // Check if last message is from user and we haven't processed it yet
    if (
      lastMessage.sender === 'user' &&
      lastMessage.id !== lastProcessedMessageIdRef.current
    ) {
      // Mark this message as processed
      lastProcessedMessageIdRef.current = lastMessage.id;

      // Trigger Gen AI reply
      triggerGenAIReply();
    }
  }, [messages, consignee.isGenAI, isGenAITyping, triggerGenAIReply]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessage: Omit<ChatMessage, 'id'> = {
      consigneeId: consignee.id,
      sender: 'agent',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isGenAI: consignee.isGenAI || false,
    };

    try {
      setIsSending(true);

      // Optimistic update
      const tempId = `temp_${Date.now()}`;
      const tempMessage = { ...newMessage, id: tempId };
      setMessages((prev) => [...prev, tempMessage as ChatMessage]);

      // Send to server
      const savedMessage = await chatService.sendMessage(newMessage);

      // Replace temp message with server response
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? savedMessage : m))
      );

      addToast('Message sent', 'success');
    } catch (error) {
      console.error('Failed to send message:', error);
      addToast('Failed to send message', 'error');
      // Remove optimistic message on error
      const tempId = `temp_${Date.now()}`;
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader text="Loading chat..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <Header
        title={consignee.name}
        subtitle={`${consignee.phone} • ${consignee.chatStatus}`}
        userId={consignee.id}
      />

      <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
        {messages.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-16 h-16 text-primary-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
            title="No messages yet"
            description="Start the conversation"
          />
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isGenAITyping && (
              <div className="flex justify-start mb-6">
                <div className="flex gap-3 max-w-xs lg:max-w-md">
                  {/* AI Agent Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-secondary-surface flex items-center justify-center shadow-md border-[3px] border-secondary-main overflow-hidden">
                      <img 
                        src="/bot.png" 
                        alt="AI Agent"
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                  </div>
                  
                  {/* Typing Indicator */}
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-secondary-surface border border-secondary-border shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-secondary-main rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-secondary-main rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-secondary-main rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ReplyBar
        onSend={handleSendMessage}
        disabled={isSending || consignee.isGenAI || consignee.chatStatus === 'closed'}
        placeholder={
          consignee.isGenAI
            ? 'AI agent is handling this conversation...'
            : 'Type a message...'
        }
        onClose={onClose}
      />
    </div>
  );
};

export default ChatWindow;
