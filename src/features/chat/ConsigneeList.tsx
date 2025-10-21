import React, { useEffect, useState } from 'react';
import type { Consignee, ChatStatus } from '../../types';
import { chatService } from '../../services/api/chatService';
import ChatListItem from '../../components/ChatListItem';
import SearchBar from '../../components/SearchBar';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';

interface ConsigneeListProps {
  onSelectConsignee: (consignee: Consignee) => void;
  selectedConsigneeId: number | string | null;
}

const ConsigneeList: React.FC<ConsigneeListProps> = ({
  onSelectConsignee,
  selectedConsigneeId,
}) => {
  const [consignees, setConsignees] = useState<Consignee[]>([]);
  const [filteredConsignees, setFilteredConsignees] = useState<Consignee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChatStatus>('all');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { addToast } = useToast();

  useEffect(() => {
    fetchConsignees();
  }, []);

  useEffect(() => {
    filterConsignees();
  }, [debouncedSearch, statusFilter, consignees]);

  const fetchConsignees = async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getConsignees();
      setConsignees(data);
      setFilteredConsignees(data);
    } catch (error) {
      addToast('Failed to load consignees', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterConsignees = () => {
    let filtered = [...consignees];

    // Filter by search term (phone number)
    if (debouncedSearch) {
      filtered = filtered.filter((c) =>
        c.phone.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.chatStatus === statusFilter);
    }

    setFilteredConsignees(filtered);
  };

  if (isLoading) {
    return <Loader text="Loading consignees..." />;
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Chats</h2>

        <div className="space-y-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by phone number..."
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ChatStatus)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:shadow-focus-secondary focus:border-secondary-main transition-shadow"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConsignees.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
            title="No consignees found"
            description="Try adjusting your filters"
          />
        ) : (
          filteredConsignees.map((consignee) => (
            <ChatListItem
              key={consignee.id}
              consignee={consignee}
              isActive={selectedConsigneeId === consignee.id}
              onClick={() => onSelectConsignee(consignee)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConsigneeList;
