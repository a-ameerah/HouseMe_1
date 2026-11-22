import React from 'react';
import { ThumbsUp, Flag, MessageSquare, Clock } from 'lucide-react';
import { Review } from '../../data/types';
import { isReviewOutdated } from '../../lib';
import { Avatar } from './Avatar';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (id: string) => void;
  onReport?: (id: string) => void;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpful,
  onReport,
  className = '',
}) => {
  const isOutdated = isReviewOutdated(review.createdAt);

  const getLabelBadge = (label: string) => {
    switch (label) {
      case 'viewed_via_app':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
            Viewed via app
          </span>
        );
      case 'lives_here':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 border border-brand-200">
            Lives here
          </span>
        );
      case 'knows_area':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-line text-ink-700 border border-line">
            Knows the area
          </span>
        );
      default:
        return null;
    }
  };

  const getRatingBadge = (topic: string, level: string) => {
    if (level === 'skipped') return null;
    let bg = 'bg-brand-50 text-brand-700 border-brand-100';
    if (level === 'okay') bg = 'bg-amber-50 text-amber-900 border-[#FFE0A3]';
    if (level === 'bad') bg = 'bg-red-50 text-red-900 border-[#F8B4B4]';

    return (
      <span
        key={topic}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold border capitalize ${bg}`}
      >
        {topic}: {level}
      </span>
    );
  };

  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className={`p-5 rounded-xl bg-surface border border-line shadow-sm text-ink-900 ${className}`}
    >
      {/* Author Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Avatar name={review.authorName} size="sm" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-ink-900">{review.authorName}</span>
              {review.labels.map((l) => (
                <React.Fragment key={l}>{getLabelBadge(l)}</React.Fragment>
              ))}
            </div>
            <span className="text-xs text-ink-700 mt-0.5">{formattedDate}</span>
          </div>
        </div>

        {isOutdated && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-ink-700 border border-line text-xs font-medium shrink-0">
            <Clock className="w-3.5 h-3.5 text-ink-700" />
            <span>Outdated, over 12 months</span>
          </div>
        )}
      </div>

      {/* Rating chips strip */}
      <div className="flex items-center gap-2 flex-wrap my-3">
        {Object.entries(review.ratings).map(([topic, level]) =>
          getRatingBadge(topic, level)
        )}
      </div>

      {/* Review text */}
      <p className="text-sm text-ink-900 leading-relaxed my-3">{review.text}</p>

      {/* Helpful and Report actions */}
      <div className="flex items-center justify-between pt-3 border-t border-line text-sm text-ink-700">
        <button
          type="button"
          onClick={() => onHelpful?.(review.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-brand-50 hover:text-brand-700 transition-colors min-h-[40px]"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Helpful ({review.helpfulCount})</span>
        </button>

        <button
          type="button"
          onClick={() => onReport?.(review.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-900 transition-colors min-h-[40px]"
        >
          <Flag className="w-4 h-4" />
          <span>Report</span>
        </button>
      </div>

      {/* Agent Reply (Indented) */}
      {review.agentReply && (
        <div className="mt-4 ml-4 p-4 rounded-xl bg-brand-50 border-l-2 border-brand-600 text-sm">
          <div className="flex items-center gap-2 text-ink-900 font-bold mb-1.5">
            <MessageSquare className="w-4 h-4 text-brand-700" />
            <span>Response from {review.agentReply.agentName}</span>
          </div>
          <p className="text-sm text-ink-700 leading-relaxed">
            {review.agentReply.text}
          </p>
        </div>
      )}
    </div>
  );
};
