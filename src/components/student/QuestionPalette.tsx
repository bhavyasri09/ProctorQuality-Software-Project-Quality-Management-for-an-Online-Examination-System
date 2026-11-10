import React, { useState } from 'react';
import { Question, QuestionState } from '../../types';

interface QuestionPaletteProps {
  questions: Question[];
  currentQuestionIndex: number;
  questionStates: Record<number, QuestionState>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentQuestionIndex,
  questionStates,
  onSelectQuestion,
}) => {
  const [filter, setFilter] = useState<'all' | 'answered' | 'review' | 'unanswered'>('all');

  const counts = {
    answered: questions.filter((q) => questionStates[q.id] === 'answered').length,
    review: questions.filter((q) => questionStates[q.id] === 'review').length,
    unanswered: questions.filter((q) => questionStates[q.id] === 'unanswered').length,
    not_visited: questions.filter((q) => !questionStates[q.id] || questionStates[q.id] === 'not_visited').length,
  };

  const filteredQuestions = questions.filter((q) => {
    const state = questionStates[q.id] || 'not_visited';
    if (filter === 'all') return true;
    if (filter === 'answered') return state === 'answered';
    if (filter === 'review') return state === 'review';
    if (filter === 'unanswered') return state === 'unanswered';
    return true;
  });

  const getStateClasses = (state: QuestionState, isCurrent: boolean) => {
    let base = 'transition-all font-mono font-bold text-xs rounded-xl flex items-center justify-center h-10 w-full ';
    if (isCurrent) {
      base += 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 z-10 ';
    }

    switch (state) {
      case 'answered':
        // Green
        return (
          base +
          'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 border border-emerald-500'
        );
      case 'review':
        // Yellow / Amber
        return (
          base +
          'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/30 border border-amber-400'
        );
      case 'unanswered':
        // Red
        return (
          base +
          'bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/30 border border-rose-500'
        );
      case 'not_visited':
      default:
        // Gray
        return (
          base +
          'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
        );
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Question Palette Grid
        </h4>
        <span className="text-xs font-mono text-slate-500">
          {counts.answered} / {questions.length} Solved
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-[11px] font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1 px-2 rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All ({questions.length})
        </button>
        <button
          onClick={() => setFilter('answered')}
          className={`flex-1 py-1 px-2 rounded-lg transition-all ${
            filter === 'answered'
              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
          }`}
        >
          Ans ({counts.answered})
        </button>
        <button
          onClick={() => setFilter('review')}
          className={`flex-1 py-1 px-2 rounded-lg transition-all ${
            filter === 'review'
              ? 'bg-amber-500 text-slate-950 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
          }`}
        >
          Rev ({counts.review})
        </button>
        <button
          onClick={() => setFilter('unanswered')}
          className={`flex-1 py-1 px-2 rounded-lg transition-all ${
            filter === 'unanswered'
              ? 'bg-rose-600 text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-rose-500'
          }`}
        >
          Unans ({counts.unanswered})
        </button>
      </div>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-4 gap-2">
        {filteredQuestions.map((q) => {
          const originalIndex = questions.findIndex((orig) => orig.id === q.id);
          const state = questionStates[q.id] || 'not_visited';
          const isCurrent = originalIndex === currentQuestionIndex;

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(originalIndex)}
              className={getStateClasses(state, isCurrent)}
              title={`Question ${q.id}: ${state.replace('_', ' ')}`}
            >
              {q.id < 10 ? `0${q.id}` : q.id}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-y-2 gap-x-3 text-[11px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-600 shrink-0" />
          <span>Answered ({counts.answered})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500 shrink-0" />
          <span>Marked Review ({counts.review})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-rose-600 shrink-0" />
          <span>Unanswered ({counts.unanswered})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
          <span>Not Visited ({counts.not_visited})</span>
        </div>
      </div>
    </div>
  );
};
