import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  userId?: number | string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, userId = 1 }) => {
  // Parse subtitle if it contains phone and status (format: "phone • status")
  const parseSubtitle = () => {
    if (!subtitle) return null;
    
    const parts = subtitle.split('•').map(part => part.trim());
    if (parts.length === 2) {
      return { phone: parts[0], status: parts[1] };
    }
    return { phone: subtitle, status: null };
  };

  const parsed = parseSubtitle();

  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Avatar Image */}
        <div className="flex-shrink-0">
          <img
            src={`https://i.pravatar.cc/48?u=${userId}`}
            alt={title}
            className="w-12 h-12 rounded-full border-2 border-primary-main object-cover"
          />
        </div>

        {/* Content - Name and Phone on left, Status on right */}
        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
          {/* Left Side: Name and Phone */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-neutral-900 mb-1">{title}</h1>
            
            {parsed && parsed.phone && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm font-medium text-neutral-600">{parsed.phone}</span>
              </div>
            )}
          </div>
          
          {/* Right Side: Status Badge */}
          {parsed && parsed.status && (
            <div className="flex-shrink-0">
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                parsed.status.toLowerCase() === 'open'
                  ? 'bg-primary-main text-white'
                  : 'bg-neutral-300 text-neutral-700'
              }`}>
                {parsed.status.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
