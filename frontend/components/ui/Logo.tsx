import React from 'react';
interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center  ${className}`}>
      {/* <img src='logo.png' alt="Shikshak Logo" className='h-20' /> */}
      <span className={`font-bold text-2xl tracking-tight `}>
        Shikshak
      </span>
    </div>
  );
};

export default Logo;