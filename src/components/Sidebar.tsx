import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const tabs = [
    {
      id: 'home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      label: 'Home',
    },
    {
      id: 'chat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      label: 'Conversations',
    },
  ];

  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo Section */}
      <div className="cursor-pointer px-6 py-[14px] border-b border-gray-200 flex items-center justify-center" onClick={() => navigate('/')}>
        <img src="/starlink-logo.png" alt="Starlink" className="h-10 w-auto" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col gap-4 p-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`group cursor-pointer w-full px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-main text-white shadow-md'
                : 'bg-neutral-100 text-neutral-700 hover:bg-primary-surface hover:text-primary-main'
            }`}
            title={tab.label}
          >
            <span className="transform transition-transform group-hover:translate-x-0.5">
              {tab.icon}
            </span>
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
