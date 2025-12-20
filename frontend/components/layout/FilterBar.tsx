'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search, Check, Filter } from 'lucide-react';
import { TabOption, SortOption } from '@/types/course';

interface FilterState {
  grades: string[];
  boards: string[];
  subjects: string[];
}

interface FilterBarProps {
  filters: FilterState;
  toggleFilter: (type: keyof FilterState, value: string) => void;
  removeFilter: (type: keyof FilterState, value: string) => void;
  clearAllFilters: () => void;
  
  activeTab: TabOption;
  setActiveTab: (tab: TabOption) => void;
  resultCount: number;
  sortOption: SortOption;
  setSortOption: (opt: SortOption) => void;
  
  // Available Options
  availableClasses: string[];
  availableBoards: string[];
  availableSubjects: string[];
  
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  toggleFilter,
  removeFilter,
  clearAllFilters,
  activeTab, 
  setActiveTab, 
  resultCount,
  sortOption,
  setSortOption,
  availableClasses,
  availableBoards,
  availableSubjects,
  searchQuery,
  setSearchQuery
}) => {
  const tabs: TabOption[] = ['All', 'Paid', 'Sale', 'Free', 'Bundle'];

  return (
    <div className="space-y-3 sm:space-y-6 mb-2 sm:mb-8">
      
      {/* Top Controls: Search & Dropdowns */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
        
        {/* Search Input */}
        <div className="relative w-full lg:w-96">
           <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 text-sm transition-all shadow-sm"
           />
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 w-full lg:w-auto">
             <FilterDropdown 
               label="Class" 
               options={availableClasses} 
               selectedValues={filters.grades} 
               onToggle={(val) => toggleFilter('grades', val)} 
             />
             <FilterDropdown 
               label="Board" 
               options={availableBoards} 
               selectedValues={filters.boards} 
               onToggle={(val) => toggleFilter('boards', val)} 
             />
             <FilterDropdown 
               label="Subject" 
               options={availableSubjects} 
               selectedValues={filters.subjects} 
               onToggle={(val) => toggleFilter('subjects', val)} 
             />
        </div>
      </div>

      {/* Active Filter Chips */}
      {(filters.grades.length > 0 || filters.boards.length > 0 || filters.subjects.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
           <span className="text-xs font-bold text-gray-400 uppercase mr-1 sm:mr-2 flex items-center gap-1">
             <Filter size={12} /> Active:
           </span>
           
           {/* Grades */}
           {filters.grades.map(grade => (
             <FilterChip key={grade} label={grade} onRemove={() => removeFilter('grades', grade)} color="blue" />
           ))}
           {/* Boards */}
           {filters.boards.map(board => (
             <FilterChip key={board} label={board} onRemove={() => removeFilter('boards', board)} color="purple" />
           ))}
           {/* Subjects */}
           {filters.subjects.map(subject => (
             <FilterChip key={subject} label={subject} onRemove={() => removeFilter('subjects', subject)} color="teal" />
           ))}

           <button 
             onClick={clearAllFilters}
             className="text-xs text-red-400 hover:text-red-600 font-medium ml-2 underline"
           >
             Clear
           </button>
        </div>
      )}

      {/* Inline on Mobile */}
      <div className="flex flex-row items-center justify-between bg-white p-2 rounded-lg border border-gray-100 shadow-sm gap-2">
        
        {/* Tabs - Horizontal Scroll */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1">
            {tabs.map(tab => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={` cursor-pointer px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                    activeTab === tab 
                    ? 'text-gray-900 bg-gray-100 shadow-sm' 
                    : 'text-gray-500 hover:text-brand-500 hover:bg-gray-50'
                }`}
                >
                {tab === 'All' ? 'All' : tab}
                </button>
            ))}
          </div>
        </div>

        {/* Separator (Desktop only) */}
        <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

        {/* Sort - Compact */}
        <div className="flex items-center gap-2 flex-shrink-0 pl-1 border-l sm:border-l-0 border-gray-100">
             <span className="text-xs text-gray-500 hidden sm:inline">Sort:</span>
             <select 
               value={sortOption}
               onChange={(e) => setSortOption(e.target.value as SortOption)}
               className="bg-transparent text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none cursor-pointer py-1 max-w-[100px] sm:max-w-none truncate"
             >
               <option value="relevance">Recommended</option>
               <option value="price-low">Price: Low</option>
               <option value="price-high">Price: High</option>
               <option value="rating">Top Rated</option>
             </select>
        </div>

      </div>
    </div>
  );
};

// Internal Sub-components

const FilterChip = ({ label, onRemove, color }: { label: string, onRemove: () => void, color: 'blue'|'purple'|'teal' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    teal: 'bg-teal-50 text-teal-700 border-teal-100'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border text-[10px] sm:text-xs font-medium shadow-sm ${colorClasses[color]}`}>
      <span className="truncate max-w-[60px] sm:max-w-none">{label}</span>
      <button onClick={onRemove} className="hover:opacity-75 transition-opacity flex-shrink-0">
        <X className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px]" />
      </button>
    </span>
  );
};

const FilterDropdown = ({ label, options, selectedValues, onToggle }: { label: string, options: string[], selectedValues: string[], onToggle: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCount = selectedValues.length;

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-1 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all shadow-sm w-full lg:w-auto sm:min-w-[140px]
          ${activeCount > 0 ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}
        `}
      >
        <span className="truncate">
          {label} {activeCount > 0 && `(${activeCount})`}
        </span>
        <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-[180px] sm:w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 space-y-0.5 max-h-64 overflow-y-auto custom-scrollbar">
            {options.map(option => {
              const isActive = selectedValues.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => onToggle(option)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-xs sm:text-sm rounded-md transition-colors text-left
                    ${isActive ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  <span className="truncate">{option}</span>
                  {isActive && <Check size={14} className="text-brand-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;