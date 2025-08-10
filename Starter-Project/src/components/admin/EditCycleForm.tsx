"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCycleClient, deleteCycleClient } from '@/lib/client-admin-api';

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
  cycleId: number;
}

export default function EditCycleForm({ cycle, cycleId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: cycle.name || '',
    start_date: cycle.start_date ? cycle.start_date.split('T')[0] : '',
    end_date: cycle.end_date ? cycle.end_date.split('T')[0] : '',
    description: cycle.description || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateCycleClient(cycleId, formData);
      router.push('/admin/cycles');
      router.refresh();
    } catch (error) {
      console.error('Failed to update cycle:', error);
      alert('Failed to update cycle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteCycleClient(cycleId);
      router.push('/admin/cycles');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete cycle:', error);
      alert('Failed to delete cycle. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cycle Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Cycle name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
              Start date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
              End date
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Status Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Cycle Status</h4>
              <p className="text-sm text-gray-600 mt-1">
                This cycle is currently {cycle.is_active ? 'active' : 'inactive'}
              </p>
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              cycle.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {cycle.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          >
            Delete Cycle
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/cycles')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Cycle'}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{cycle.name}</strong>? This action cannot be undone.
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
