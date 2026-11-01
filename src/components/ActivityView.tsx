import React, { useState } from 'react';
import {
  Activity as ActivityIcon,
  Mail,
  Folder,
  Scissors,
  Wallet,
  Send,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export const ActivityView: React.FC = () => {
  const { activities } = useWorkspace();
  const [filterType, setFilterType] = useState<string>('All');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4 text-[#2B6CB0]" />;
      case 'file':
        return <Folder className="w-4 h-4 text-[#216F50]" />;
      case 'revision':
        return <Scissors className="w-4 h-4 text-[#B45309]" />;
      case 'payment':
        return <Wallet className="w-4 h-4 text-[#B91C1C]" />;
      case 'deliverable':
        return <Send className="w-4 h-4 text-[#6366F1]" />;
      case 'campaign':
        return <Layers className="w-4 h-4 text-[#216F50]" />;
      default:
        return <CheckCircle className="w-4 h-4 text-[#185A42]" />;
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'All') return true;
    return act.type === filterType.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <span className="text-xs font-bold text-[#216F50] uppercase tracking-wider block mb-1">
          ACTIVITY
        </span>
        <h1 className="text-3xl font-bold text-[#171A18] tracking-tight">
          Collaboration timeline & audit trail
        </h1>
        <p className="text-sm text-[#68716D] mt-1 max-w-3xl">
          Automatic logs of emails received, creative files uploaded, revisions recorded and invoices processed.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['All', 'Email', 'File', 'Revision', 'Deliverable', 'Payment', 'Task'].map((type) => {
          const isActive = filterType === type;
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#216F50] text-white shadow-2xs'
                  : 'bg-white text-[#68716D] hover:text-[#171A18] hover:bg-[#F3F4F0] border border-[#E5E6E1]'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Timeline Card */}
      <div className="bg-white border border-[#E5E6E1] rounded-2xl shadow-2xs p-6">
        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E5E6E1]">
          {filteredActivities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Dot / Icon */}
              <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-white border border-[#E5E6E1] flex items-center justify-center -translate-x-1/2 shadow-2xs">
                {getActivityIcon(act.type)}
              </div>

              <div className="bg-[#F7F7F4] hover:bg-[#F0F1ED] transition-colors p-4 rounded-xl border border-[#E5E6E1]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#171A18]">
                      {act.title}
                    </span>
                    <span className="bg-[#EBF5F0] text-[#216F50] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {act.brandName}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8A918D]">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#68716D] mt-1 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
