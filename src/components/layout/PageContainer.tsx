import React from 'react';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px] py-6 lg:py-8 space-y-6 lg:space-y-8 ${className}`}
    {...props}
  >
    {children}
  </div>
);
