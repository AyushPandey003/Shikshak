import React from 'react';

interface CustomLoaderProps {
  className?: string;
  size?: number;
  color?: string;
}

export const CustomLoader: React.FC<CustomLoaderProps> = ({
  className = "",
  size = 40,
  color = "currentColor"
}) => {
  const strokeColor = color === "currentColor" ? undefined : color;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 50"
        xmlns="http://www.w3.org/2000/svg"
        className="custom-loader-svg"
      >
        {/* Background Track */}
        <path
          d="M25,25 C10,25 10,5 25,5 C40,5 50,25 75,25 C90,25 90,5 75,5 C60,5 50,25 25,25 Z
             M25,25 C10,25 10,45 25,45 C40,45 50,25 75,25 C90,25 90,45 75,45 C60,45 50,25 25,25 Z"
          fill="none"
          stroke={strokeColor || "currentColor"}
          strokeWidth="6"
          opacity="0.1"
          strokeLinecap="round"
        />

        {/* Animated Path */}
        <path
          d="M25,25 C10,25 10,5 25,5 C40,5 50,25 75,25 C90,25 90,5 75,5 C60,5 50,25 25,25 Z
             M25,25 C10,25 10,45 25,45 C40,45 50,25 75,25 C90,25 90,45 75,45 C60,45 50,25 25,25 Z"
          fill="none"
          stroke={strokeColor || "currentColor"}
          strokeWidth="6"
          strokeLinecap="round"
          className="infinity-path"
        />
      </svg>
      <style jsx>{`
        .custom-loader-svg {
          overflow: visible;
        }
        .infinity-path {
          stroke-dasharray: 240; /* Approximate length of the path */
          stroke-dashoffset: 240;
          animation: infinityScroll 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes infinityScroll {
          0% {
            stroke-dashoffset: 240;
          }
          50% {
             stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -240;
          }
        }
      `}</style>
    </div>
  );
};
