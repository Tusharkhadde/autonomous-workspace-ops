import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/** Standard content container used by every app view. */
export const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => (
  <div className={cn('page-container', className)}>{children}</div>
);
