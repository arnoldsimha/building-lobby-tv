import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMessages } from '../../hooks/useApi';
import WidgetBox from '../common/WidgetBox';
import LoadingSpinner from '../common/LoadingSpinner';
import FadeTransition from '../common/FadeTransition';
import type { Message, MessageType } from '../../services/types';

/** Icon map for message types */
const MESSAGE_TYPE_ICONS: Record<MessageType, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  urgent: '🚨',
  event: '📅',
};

const ROTATION_INTERVAL = 10_000;
const MESSAGES_PER_PAGE = 3;

/**
 * Premium building messages widget with glass-style message cards.
 * Shows 3 messages at a time with auto-rotation.
 */
export default function MessagesWidget() {
  const { t } = useTranslation();
  const { data: messages, isLoading, isError } = useMessages();
  const [pageIndex, setPageIndex] = useState(0);

  const activeMessages: Message[] = (messages ?? []).filter((m) => m.active);
  const totalPages = Math.max(1, Math.ceil(activeMessages.length / MESSAGES_PER_PAGE));

  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % totalPages);
    }, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [totalPages]);

  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(0);
    }
  }, [totalPages, pageIndex]);

  const startIdx = pageIndex * MESSAGES_PER_PAGE;
  const currentPageMessages = activeMessages.slice(startIdx, startIdx + MESSAGES_PER_PAGE);

  const formatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return '';
    }
  };

  const renderMessage = useCallback((message: Message) => {
    const icon = MESSAGE_TYPE_ICONS[message.type] ?? 'ℹ️';
    const isUrgent = message.type === 'urgent';
    const dateStr = formatDate(message.createdAt);

    return (
      <div
        key={message.id}
        className={`rounded-xl px-5 py-4 border backdrop-blur-md transition-all ${
          isUrgent
            ? 'bg-red-900/70 border-red-400/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
            : 'bg-slate-900/70 border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.2)]'
        }`}
      >
        <div className="flex items-start gap-2 mb-2">
          <span className="text-lg shrink-0">{icon}</span>
          <span className={`text-message-title font-bold ${isUrgent ? 'text-red-200' : 'text-white'}`}>
            {message.title}
          </span>
          {dateStr && (
            <span className="text-xs text-white/50 mr-auto shrink-0 pt-1">{dateStr}</span>
          )}
        </div>
        <p className="text-message-text text-white/85 mr-7 m-0 leading-relaxed">
          {message.content}
        </p>
      </div>
    );
  }, []);

  return (
    <WidgetBox icon="📋" title={t('widgets.messages')}>
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : isError ? (
        <p className="text-red-400 text-lg">{t('common.error')}</p>
      ) : activeMessages.length === 0 ? (
        <p className="text-white/50 text-widget-content text-center">
          {t('messages.noMessages')}
        </p>
      ) : (
        <div className="min-h-[120px]">
          <FadeTransition transitionKey={pageIndex} duration={800}>
            <div className="flex flex-col gap-3">
              {currentPageMessages.map((msg) => renderMessage(msg))}
            </div>
          </FadeTransition>

          {/* Pagination dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalPages }, (_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === pageIndex
                      ? 'bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]'
                      : 'bg-white/25'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </WidgetBox>
  );
}
