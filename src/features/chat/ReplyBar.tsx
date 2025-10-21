import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import Button from '../../components/Button';

interface ReplyBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onClose?: () => void;
}

const ReplyBar: React.FC<ReplyBarProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
  onClose,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:shadow-focus-secondary focus:border-secondary-main disabled:bg-neutral-100 disabled:cursor-not-allowed transition-shadow text-neutral-900 placeholder-neutral-400"
        />
        
        {/* Send Button - Using Button component like login */}
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          variant="secondary"
          size="lg"
          className="flex-shrink-0"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </Button>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all focus:outline-none focus:shadow-focus-secondary cursor-pointer"
            title="Close chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReplyBar;
