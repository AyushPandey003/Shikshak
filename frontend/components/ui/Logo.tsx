import React from 'react';
interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src='/logo.png' alt="Shikshak Logo" className='h-full w-auto' />
      <span className={`font-bold text-2xl tracking-tight `}>
        Shikshak
      </span>
    </div>
  );
};

export default Logo;