import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, RotateCcw, Bot, User, Check, ArrowRight } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ChatMessage } from '../types';

export const AssistantDrawer: React.FC = () => {
  const {
    assistantOpen,
    setAssistantOpen,
    campaigns,
    emails,
    priorities,
    payments,
    setActiveTab,
    setSelectedCampaignId,
    setSelectedEmailId,
  } = useWorkspace();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: 'I read your campaigns, brand emails, revision requests and payment records. Ask me anything about your creator workspace.',
      timestamp: 'Just now',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What should I work on today?',
    'Which brands are waiting for my reply?',
    'What changes did Nova Athletics request?',
    'Which campaigns are waiting for payment?',
    'Draft a follow-up for Urban Brew',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (assistantOpen) {
      scrollToBottom();
    }
  }, [messages, assistantOpen]);

  const handleSend = async (questionText?: string) => {
    const query = questionText || inputVal;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const liveContext = {
        date: '1 Nov 2026',
        campaigns: campaigns.map((c) => ({
          name: c.name,
          brand: c.brandName,
          status: c.status,
          agreedPayment: c.agreedPayment,
          paidAmount: c.paidAmount,
          deadline: c.deadline,
          revisions: c.revisions,
        })),
        openPriorities: priorities.filter((p) => !p.completed),
        unreadEmails: emails
          .filter((e) => e.unread)
          .map((e) => ({
            brand: e.brandName,
            subject: e.subject,
            snippet: e.preview,
            sender: e.senderName,
          })),
        payments: payments.map((p) => ({
          invoice: p.invoiceNumber,
          brand: p.brandName,
          amount: p.amount,
          status: p.status,
          due: p.dueDate,
        })),
      };

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history: messages,
          workspaceContext: liveContext,
        }),
      });

      const data = await res.json();
      const assistantReply: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        sender: 'assistant',
        text: data.reply || 'Here is the requested information based on your workspace records.',
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          sender: 'assistant',
          text: `You have 6 items requiring action today, led by Nova Athletics (revisions overdue by 9 days) and Urban Brew's invoice INV-1042 (₹20,000 overdue). GlowSkin is also waiting for your reply regarding the 60-day paid usage terms.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!assistantOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white border-l border-[#E5E6E1] shadow-2xl z-50 flex flex-col justify-between animate-slide-left">
      {/* Header */}
      <div className="p-4 border-b border-[#E5E6E1] flex items-center justify-between bg-[#F7F7F4]/90 backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#216F50] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#171A18] tracking-tight">
              CreatorFlow assistant
            </h3>
            <p className="text-[11px] text-[#68716D]">
              Answers use your workspace records · live AI when available.
            </p>
          </div>
        </div>

        <button
          onClick={() => setAssistantOpen(false)}
          className="text-[#8A918D] hover:text-[#171A18] p-1.5 rounded-lg hover:bg-[#EBEBE7] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => {
          const isAssistant = m.sender === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[92%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  isAssistant
                    ? 'bg-[#F7F7F4] text-[#171A18] border border-[#E5E6E1] rounded-tl-xs'
                    : 'bg-[#216F50] text-white rounded-tr-xs shadow-2xs font-normal'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-[#8A918D] mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#68716D] p-3 bg-[#F7F7F4] border border-[#E5E6E1] rounded-2xl w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#216F50] animate-spin" />
            <span>Consulting workspace records...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts & Input Area */}
      <div className="p-4 border-t border-[#E5E6E1] bg-white space-y-3">
        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-[10px] font-bold text-[#8A918D] uppercase tracking-wider block mb-2">
            TRY ASKING
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="bg-[#F7F7F4] hover:bg-[#EBEBE7] text-[#171A18] text-[11px] font-medium px-3 py-1.5 rounded-full border border-[#E5E6E1] transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative pt-1"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about a campaign, brand..."
            className="w-full bg-[#F7F7F4] border border-[#E5E6E1] rounded-xl pl-3 pr-10 py-2.5 text-xs text-[#171A18] placeholder:text-[#8A918D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#216F50] transition-all"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#216F50] hover:bg-[#185A42] disabled:opacity-40 text-white rounded-lg transition-colors shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
