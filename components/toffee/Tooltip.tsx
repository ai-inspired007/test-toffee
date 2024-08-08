import React, { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, className }) => (
  <div className="relative group">
    {children}
    <div className={`absolute z-10 hidden group-hover:block ${className}`}>
      {text}
    </div>
  </div>
);

export default Tooltip;
