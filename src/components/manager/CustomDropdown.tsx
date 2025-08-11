// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import ReactDOM from "react-dom";

// interface Reviewer {
//   id: string;
//   name: string;
//   stats: string;
//   reviews: number;
// }

// interface Application {
//   id: string;
//   applicant_name: string;
//   submitted?: string;
//   assigned_reviewer_name: string;
//   status: string;
// }

// interface Action {
//   name: string;
//   onClick: () => void;
//   ref?: React.RefObject<HTMLDivElement>;
// }

// interface CustomDropdownProps {
//   reviewers: Reviewer[];
//   app: Application;
//   refetchApplications: () => void;
// }

// const CustomDropdown: React.FC<CustomDropdownProps> = ({ reviewers, app, refetchApplications }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isAssignOpen, setIsAssignOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const assignRef = useRef<HTMLDivElement>(null);
//   const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
//   const { data: session, status } = useSession();
//   const accessToken = session?.accessToken;
//   const router = useRouter();

//   const handleAssignReviewer = async (reviewerId: string, reviewerName: string) => {
//     try {
//       const response = await fetch(BASE_URL + `/manager/applications/${app.id}/assign`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${accessToken}`
//         },
//         body: JSON.stringify({ reviewer_id: reviewerId }),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to assign reviewer');
//       }
//       console.log(`Assigned ${app.applicant_name} to ${reviewerName}`);
//       setIsAssignOpen(false);
//       setIsOpen(false);
//       refetchApplications();
//     } catch (error) {
//       console.error('Error assigning reviewer:', error);
//     }
//   };

//   const actions: Action[] = [
//     { name: 'Review', onClick: () => router.push(`/manager/review/${app.id}`)},
//     { name: 'View Details', onClick: () => { window.location.href = `/manager/${app.id}`; } },
//     { name: 'Assign to Reviewer', onClick: () => setIsAssignOpen(!isAssignOpen), ref: assignRef },
//   ];

//   const filteredReviewers = reviewers.filter((reviewer) =>
//     reviewer.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//         setIsAssignOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="inline-flex justify-between w-32 p-1 bg-white border-1 border-gray-200 rounded-md text-indigo-700 text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
//       >
//         Actions <span className="ml-1">▼</span>
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 w-32 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 transition-all duration-200 ease-in-out">
//           {actions.map((action) => (
//             <div
//               key={action.name}
//               onClick={action.onClick}
//               ref={action.ref}
//               className="px-2 py-1 text-gray-700 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
//             >
//               {action.name}
//               {action.name === 'Assign to Reviewer' && <span className="ml-1">▶</span>}
//             </div>
//           ))}
//         </div>
//       )}

//       {isAssignOpen && assignRef.current && ReactDOM.createPortal(
//         <div
//           className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-50 transition-all duration-200 ease-in-out"
//           style={{
//             top: assignRef.current.getBoundingClientRect().bottom + window.scrollY - 40,
//             left: assignRef.current.getBoundingClientRect().right + window.scrollX + 8,
//             width: '16rem',
//           }}
//         >
//           <div className="p-2">
//             <input
//               type="text"
//               placeholder="Search for a reviewer"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="max-h-40 overflow-y-auto">
//             {filteredReviewers.map((reviewer) => (
//               <div
//                 key={reviewer.id}
//                 onClick={() => handleAssignReviewer(reviewer.id, reviewer.name)}
//                 className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
//               >
//                 <span className="w-4 h-4 bg-gray-400 rounded-full mr-2"></span>
//                 {reviewer.name}
//               </div>
//             ))}
//           </div>
//         </div>,
//         document.body
//       )}
//     </div>
//   );
// };

// export default CustomDropdown;


'use client';

import { useSession, signOut, getSession } from "next-auth/react";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";

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
  refetchApplications: () => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ reviewers, app, refetchApplications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const assignRef = useRef<HTMLDivElement>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data: session, status, update } = useSession();
  const accessToken = session?.accessToken;
  const router = useRouter();

  const handleAssignReviewer = async (reviewerId: string, reviewerName: string) => {
    try {
      const response = await fetch(BASE_URL + `/manager/applications/${app.id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ reviewer_id: reviewerId }),
      });
      if (!response.ok) {
        throw new Error('Failed to assign reviewer');
      }
      console.log(`Assigned ${app.applicant_name} to ${reviewerName}`);
      setIsAssignOpen(false);
      setIsOpen(false);
      refetchApplications();
    } catch (error) {
      console.error('Error assigning reviewer:', error);
    }
  };

  const actions: Action[] = [
    { name: 'Review', onClick: () => router.push(`/manager/review/${app.id}`)},
    { name: 'View Details', onClick: () => { window.location.href = `/manager/${app.id}`; } },
    { name: 'Assign to Reviewer', onClick: () => {setIsAssignOpen(!isAssignOpen)}, ref: assignRef },
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
    // MODIFIED: Removed erroneous "over-" prefix from className and ensured relative positioning
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between w-32 p-1 bg-white border border-gray-300 rounded-md text-blue-600 text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Actions <span className="ml-1">▼</span>
      </button>

      {isOpen && (
        // MODIFIED: Increased z-index to ensure overlay and added transition
        <div className="absolute right-0 w-32 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-100 transition-all duration-200 ease-in-out">
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
        // MODIFIED: Increased z-index, adjusted positioning, and ensured no layout shift
        <div
          className="absolute mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-40 transition-all duration-200 ease-in-out"
          style={{
            // MODIFIED: Adjusted top to align with the "Assign to Reviewer" option and prevent overlap
            top: assignRef.current.offsetTop + assignRef.current.offsetHeight,
            right: '100%',
            marginRight: '0.5rem',
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
                onClick={() => handleAssignReviewer(reviewer.id, reviewer.name)}
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