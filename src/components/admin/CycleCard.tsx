"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { activateCycleClient, deleteCycleClient } from '@/lib/client-admin-api';
import Link from 'next/link';

interface Cycle {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  description: string;
}

interface Props {
  cycle: Cycle;
}

export default function CycleCard({ cycle }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusInfo = () => {
    const currentDate = new Date();
    const startDate = new Date(cycle.start_date);
    const endDate = new Date(cycle.end_date);

    if (cycle.is_active) {
      if (currentDate >= startDate && currentDate <= endDate) {
        return { label: 'Open', color: 'bg-green-100 text-green-800' };
      } else if (currentDate > endDate) {
        return { label: 'Closed', color: 'bg-gray-100 text-gray-800' };
      } else {
        return { label: 'Scheduled', color: 'bg-blue-100 text-blue-800' };
      }
    } else {
      return { label: 'Closed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleActivate = async () => {
    if (cycle.is_active) return;
    
    setIsLoading(true);
    try {
      await activateCycleClient(cycle.id);
      router.refresh();
    } catch (error) {
      console.error('Failed to activate cycle:', error);
      alert('Failed to activate cycle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteCycleClient(cycle.id);
      router.refresh();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete cycle:', error);
      alert('Failed to delete cycle. Please try again.');
      setIsLoading(false);
    }
  };

  const status = getStatusInfo();

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{cycle.name}</h3>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Created {formatDate(cycle.created_at)}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Link
              href={`/admin/cycles/${cycle.id}/edit`}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit cycle"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete cycle"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">{cycle.description}</p>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Start Date:</span>
            <span className="text-gray-900">{formatDate(cycle.start_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">End Date:</span>
            <span className="text-gray-900">{formatDate(cycle.end_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="text-gray-900">{cycle.is_active ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          {!cycle.is_active && (
            <button
              onClick={handleActivate}
              disabled={isLoading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Activating...' : 'Activate Cycle'}
            </button>
          )}
          {cycle.is_active && (
            <div className="text-center text-sm text-green-600 font-medium">
              Currently Active
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the cycle <strong>{cycle.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Cycle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
