import React from 'react';
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
    className?: string;
    placeholder?: string;
    onSearch?: (query: string) => void;
}

export function SearchBar({ className = "", placeholder = "Search here...", onSearch }: SearchBarProps) {
    return (
        <div className={`w-full lg:max-w-lg md:max-w-3xs hidden md:flex ${className}`}>
            <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400">
                    <CiSearch />
                </div>
                <input
                    aria-label="Search"
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    type="text"
                    onChange={(e) => onSearch?.(e.target.value)}
                />
            </form>
        </div>
    );
}
