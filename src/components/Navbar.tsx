import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-end">
      <div className="relative cursor-pointer">
        <button
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 focus:outline-none focus:shadow-focus-secondary"
        >
          <img
            src="https://i.pravatar.cc/48/u=92105"
            alt={user?.name || 'User avatar'}
            className="w-8 h-8 rounded-full border border-primary-border object-cover"
          />
          <span className="hidden sm:block text-sm text-neutral-700">{user?.name || 'User'}</span>
          <svg className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
            <button
              onClick={handleLogout}
              className="cursor-pointer group w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-md transition-colors"
            >
              <svg
                className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900 transition-colors transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v8a2 2 0 002 2h3" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;


