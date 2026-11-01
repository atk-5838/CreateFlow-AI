import React, { useState } from 'react';
import { ArrowUpRight, Check, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { PriorityItem } from '../types';

export const PrioritiesView: React.FC = () => {
  const {
    priorities,
    todayTasksCount,
    next2DaysTasksCount,
    thisWeekTasksCount,
    togglePriorityCompleted,
    setActiveTab,
    setSelectedCampaignId,
    addPriority,
  } = useWorkspace();

  const [activeFilter, setActiveFilter] = useState<'All open' | 'Today' | 'Next 2 days' | 'This week'>('All open');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'REVISION' | 'DEADLINE' | 'EMAIL' | 'PAYMENT'>('DEADLINE');
  const [newTimeframe, setNewTimeframe] = useState<'today' | 'next2days' | 'thisweek'>('today');

  const filteredPriorities = priorities.filter((item) => {
    if (item.completed) return false;
    if (activeFilter === 'All open') return true;
    if (activeFilter === 'Today') return item.timeframe === 'today';
    if (activeFilter === 'Next 2 days') return item.timeframe === 'next2days';
    if (activeFilter === 'This week') return item.timeframe === 'thisweek';
    return true;
  });

  const handleOpenCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setActiveTab('campaigns');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addPriority({
      category: newCategory,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Direct action item created in Priorities.',
      campaignId: 'camp-nova',
      campaignName: 'Creator Workspace Task',
      brandName: 'Workspace',
      timeframe: newTimeframe,
      isOverdue: false,
      dueDate: '1 Nov 2026',
      completed: false,
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#216F50] uppercase tracking-wider block mb-1">
            PRIORITIES
          </span>
          <h1 className="text-3xl font-bold text-[#171A18] tracking-tight">
            What needs you next
          </h1>
          <p className="text-sm text-[#68716D] mt-1 max-w-3xl">
            One list assembled from revision requests, unread brand mail, delivery deadlines and unpaid invoices.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white border border-[#E5E6E1] text-[#171A18] hover:bg-[#F3F4F0] px-4 py-2 rounded-xl text-sm font-medium shadow-2xs transition-colors shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-[#216F50]" />
          <span>New task</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: TODAY */}
        <div
          onClick={() => setActiveFilter('Today')}
          className={`bg-white border rounded-2xl p-6 transition-all cursor-pointer shadow-2xs ${
            activeFilter === 'Today' ? 'border-[#216F50] ring-1 ring-[#216F50]/20' : 'border-[#E5E6E1] hover:border-[#D0D4CD]'
          }`}
        >
          <span className="text-[11px] font-bold text-[#68716D] uppercase tracking-wider block mb-3">
            TODAY
          </span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-[#171A18] tracking-tight">
              {todayTasksCount}
            </span>
            <span className="bg-[#FEF2F2] text-[#B91C1C] text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              TASKS
            </span>
          </div>
        </div>

        {/* Card 2: NEXT 2 DAYS */}
        <div
          onClick={() => setActiveFilter('Next 2 days')}
          className={`bg-white border rounded-2xl p-6 transition-all cursor-pointer shadow-2xs ${
            activeFilter === 'Next 2 days' ? 'border-[#216F50] ring-1 ring-[#216F50]/20' : 'border-[#E5E6E1] hover:border-[#D0D4CD]'
          }`}
        >
          <span className="text-[11px] font-bold text-[#68716D] uppercase tracking-wider block mb-3">
            NEXT 2 DAYS
          </span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-[#171A18] tracking-tight">
              {next2DaysTasksCount}
            </span>
            <span className="bg-[#FEF9C3] text-[#A16207] text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              TASKS
            </span>
          </div>
        </div>

        {/* Card 3: THIS WEEK */}
        <div
          onClick={() => setActiveFilter('This week')}
          className={`bg-white border rounded-2xl p-6 transition-all cursor-pointer shadow-2xs ${
            activeFilter === 'This week' ? 'border-[#216F50] ring-1 ring-[#216F50]/20' : 'border-[#E5E6E1] hover:border-[#D0D4CD]'
          }`}
        >
          <span className="text-[11px] font-bold text-[#68716D] uppercase tracking-wider block mb-3">
            THIS WEEK
          </span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-[#171A18] tracking-tight">
              {thisWeekTasksCount}
            </span>
            <span className="bg-[#F1F1ED] text-[#475569] text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              TASK
            </span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        {(['All open', 'Today', 'Next 2 days', 'This week'] as const).map((tab) => {
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#216F50] text-white shadow-2xs'
                  : 'bg-white text-[#68716D] hover:text-[#171A18] hover:bg-[#F3F4F0] border border-[#E5E6E1]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Priorities List Container */}
      <div className="bg-white border border-[#E5E6E1] rounded-2xl shadow-2xs divide-y divide-[#E5E6E1] overflow-hidden">
        {filteredPriorities.length === 0 ? (
          <div className="py-16 text-center text-[#68716D]">
            <CheckCircle2 className="w-8 h-8 text-[#216F50] mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium">All caught up in this timeframe!</p>
          </div>
        ) : (
          filteredPriorities.map((item) => (
            <div
              key={item.id}
              className="p-5 hover:bg-[#FAFAF8] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Pill */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      item.category === 'REVISION'
                        ? 'bg-[#FDF4EA] text-[#B45309]'
                        : item.category === 'DEADLINE'
                        ? 'bg-[#FEF9C3] text-[#A16207]'
                        : item.category === 'PAYMENT'
                        ? 'bg-[#FEF2F2] text-[#B91C1C]'
                        : 'bg-[#EBF5F0] text-[#216F50]'
                    }`}
                  >
                    {item.category}
                  </span>

                  {/* Task Title */}
                  <span className="font-semibold text-sm text-[#171A18]">
                    {item.title}
                  </span>

                  {/* Overdue Badge */}
                  {item.isOverdue && item.overdueText && (
                    <span className="bg-[#FEF2F2] text-[#B91C1C] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {item.overdueText}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[#68716D] line-clamp-1">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <button
                  onClick={() => togglePriorityCompleted(item.id)}
                  title="Mark Completed"
                  className="w-8 h-8 rounded-lg border border-[#E5E6E1] bg-white hover:bg-[#EBF5F0] hover:text-[#216F50] text-[#8A918D] flex items-center justify-center transition-colors shadow-2xs"
                >
                  <Check className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenCampaign(item.campaignId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E6E1] hover:bg-[#F7F7F4] text-[#171A18] text-xs font-medium rounded-lg transition-colors shadow-2xs"
                >
                  <span>Open campaign</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#68716D]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTask}
            className="bg-white rounded-2xl max-w-md w-full border border-[#E5E6E1] shadow-2xl p-6 space-y-4 animate-scale-up"
          >
            <h3 className="font-bold text-[#171A18] text-base">Add New Priority Task</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Deliver raw footage stems to GlowSkin"
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#68716D] block mb-1">
                  Supporting Note
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details, specific request, or instructions"
                  className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18]"
                  >
                    <option value="REVISION">REVISION</option>
                    <option value="DEADLINE">DEADLINE</option>
                    <option value="EMAIL">EMAIL</option>
                    <option value="PAYMENT">PAYMENT</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#68716D] block mb-1">
                    Timeframe
                  </label>
                  <select
                    value={newTimeframe}
                    onChange={(e: any) => setNewTimeframe(e.target.value)}
                    className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl px-3 py-2 text-xs text-[#171A18]"
                  >
                    <option value="today">Today</option>
                    <option value="next2days">Next 2 days</option>
                    <option value="thisweek">This week</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#68716D] hover:bg-[#F3F4F0] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-[#216F50] hover:bg-[#185A42] text-white rounded-xl shadow-xs"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
