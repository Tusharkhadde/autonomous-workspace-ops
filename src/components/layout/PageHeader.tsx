import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  icon?: React.ElementType;
  title: React.ReactNode;
  description?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

/** Consistent page header: icon chip, title, description, and optional right-aligned actions. */
export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  description,
  right,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4',
      className
    )}
  >
    <div className="flex items-start gap-3 min-w-0">
      {Icon && (
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="min-w-0">
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 flex-wrap">
          {title}
        </h2>
        {description && <p className="text-xs text-zinc-400 mt-0.5">{description}</p>}
      </div>
    </div>
    {right && <div className="shrink-0">{right}</div>}
  </div>
);
