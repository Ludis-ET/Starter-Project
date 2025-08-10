import ImprovedReviewerDashboard from '@/components/ImprovedReviewerDashboard'
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import React from 'react'

const page = () => {
  return (
    <AuthenticatedLayout>
      <ImprovedReviewerDashboard />
    </AuthenticatedLayout>
  )
}

export default page
