'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Reviewer {
  id: string;
  name: string;
  stats: string;
  reviews: number;
}

interface Application {
  id: string;
  applicant_name: string;
  submitted?: string;
  assigned_reviewer_name: string;
  status: string;
}

interface Action {
  name: string;
  onClick: () => void;
  ref?: React.RefObject<HTMLDivElement>;
}

interface CustomDropdownProps {
  reviewers: Reviewer[];
  app: Application;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ reviewers, app }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const assignRef = useRef<HTMLDivElement>(null);

  const actions: Action[] = [
    { name: 'Review', onClick: () => console.log(`Review clicked for ${app.applicant_name}`) },
    { name: 'View Details', onClick: () => { window.location.href = `/manager/${app.id}`; } },
    { name: 'Assign to Reviewer', onClick: () => setIsAssignOpen(!isAssignOpen), ref: assignRef },
  ];

  const filteredReviewers = reviewers.filter((reviewer) =>
    reviewer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAssignOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between w-32 p-1 bg-white border border-gray-300 rounded-md text-blue-600 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Actions <span className="ml-1">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 w-32 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20">
          {actions.map((action) => (
            <div
              key={action.name}
              onClick={action.onClick}
              ref={action.ref}
              className="px-2 py-1 text-gray-700 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
            >
              {action.name}
              {action.name === 'Assign to Reviewer' && <span className="ml-1">▶</span>}
            </div>
          ))}
        </div>
      )}

      {isAssignOpen && assignRef.current && (
        <div
          className="absolute mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10"
          style={{
            top: assignRef.current.offsetTop,
            left: '100%',
            marginLeft: '0.5rem',
            width: '16rem',
          }}
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Search for a reviewer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredReviewers.map((reviewer) => (
              <div
                key={reviewer.id}
                onClick={() => {
                  console.log(`Assigned ${app.applicant_name} to ${reviewer.name}`);
                  setIsAssignOpen(false);
                  setIsOpen(false);
                }}
                className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <span className="w-4 h-4 bg-gray-400 rounded-full mr-2"></span>
                {reviewer.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;