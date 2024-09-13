import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className }) => (
  <div className={`flex flex-col w-full gap-6 items-start ${className ?? ''}`}>
    {title && <span className=" text-lg font-medium leading-6 tracking-tight text-text-sub">{title}</span>}
    {children}
  </div>
);

export default Section;