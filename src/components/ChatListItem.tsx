import React from 'react';
import type { Consignee } from '../types';

interface ChatListItemProps {
  consignee: Consignee;
  isActive: boolean;
  onClick: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ consignee, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-neutral-200 cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'bg-primary-surface border-l-4 border-l-primary-main shadow-sm' 
          : 'hover:bg-neutral-100 border-l-4 border-l-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Name and Status Row */}
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-base font-semibold truncate ${
              isActive ? 'text-primary-main' : 'text-neutral-900'
            }`}>
              {consignee.name}
            </h3>
            <span
              className={`ml-2 px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                consignee.chatStatus === 'open'
                  ? 'bg-primary-main text-white'
                  : 'bg-neutral-300 text-neutral-700'
              }`}
            >
              {consignee.chatStatus.toUpperCase()}
            </span>
          </div>
          
          {/* Phone Number */}
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="text-sm font-medium text-neutral-600">{consignee.phone}</p>
          </div>
          
          {/* Last Message */}
          <p className="text-sm text-neutral-500 truncate leading-relaxed">
            {consignee.lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
