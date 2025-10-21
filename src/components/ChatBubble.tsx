import React from 'react';
import dayjs from 'dayjs';
import type { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // AI Agent Icon Component
  const AIAgentIcon = () => (
    <div className="w-10 h-10 rounded-full bg-secondary-surface flex items-center justify-center flex-shrink-0 shadow-md border-[3px] border-secondary-main overflow-hidden">
      <img 
        src="/bot.png" 
        alt="AI Agent"
        className="w-7 h-7 object-contain"
      />
    </div>
  );

  // Human Agent Icon Component
  const HumanAgentIcon = () => (
    <div className="w-10 h-10 rounded-full bg-primary-surface flex items-center justify-center flex-shrink-0 shadow-md border-[3px] border-primary-main overflow-hidden">
      <img 
        src="/call-center-agent.png" 
        alt="Human Agent"
        className="w-7 h-7 object-contain"
      />
    </div>
  );

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex gap-3 max-w-xs lg:max-w-md ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            // User avatar image
            <img
              src={`https://i.pravatar.cc/40?u=${message.consigneeId}`}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-main shadow-sm"
            />
          ) : (
            // Agent icon (AI or Human)
            message.isGenAI ? <AIAgentIcon /> : <HumanAgentIcon />
          )}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isUser
                ? 'bg-primary-main text-white rounded-br-sm'
                : message.isGenAI
                ? 'bg-secondary-surface text-neutral-900 border border-secondary-border rounded-bl-sm'
                : 'bg-primary-surface text-neutral-900 border border-primary-border rounded-bl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed break-words">{message.message}</p>
          </div>
          
          {/* Timestamp */}
          <p
            className={`text-xs mt-1 px-1 ${
              isUser ? 'text-right text-neutral-500' : 'text-left text-neutral-500'
            }`}
          >
            {dayjs(message.timestamp).format('HH:mm')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
