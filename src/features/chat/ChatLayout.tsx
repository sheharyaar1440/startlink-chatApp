import React, { useState } from 'react';
import type { Consignee } from '../../types';
import ConsigneeList from './ConsigneeList';
import ChatWindow from './ChatWindow';
import EmptyState from '../../components/EmptyState';

const ChatLayout: React.FC = () => {
  const [selectedConsignee, setSelectedConsignee] = useState<Consignee | null>(null);
  const [selectedConsigneeId, setSelectedConsigneeId] = useState<number | string | null>(null);

  const handleSelectConsignee = (consignee: Consignee) => {
    setSelectedConsignee(consignee);
    setSelectedConsigneeId(consignee.id);
  };

  const handleCloseChat = () => {
    setSelectedConsignee(null);
    setSelectedConsigneeId(null);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Panel - Consignee List */}
      <div className="w-96 flex-shrink-0">
        <ConsigneeList
          onSelectConsignee={handleSelectConsignee}
          selectedConsigneeId={selectedConsigneeId}
        />
      </div>

      {/* Right Panel - Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConsignee ? (
          <ChatWindow consignee={selectedConsignee} onClose={handleCloseChat} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <EmptyState
              icon={
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              }
              title="Welcome to Chat App"
              description="Select a consignee from the list to start chatting"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
