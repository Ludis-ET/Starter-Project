import React from 'react';
import { notFound } from 'next/navigation';

const JobDetail = ({ params }: { params: { id: string } }) => {
  // Fetch job details based on id (e.g., from API)
  const jobData = { id: params.id, title: "Job Details Placeholder" };

  if (!jobData) notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Job Details: {jobData.title}</h1>
      <p>Content for job ID: {params.id} goes here.</p>
    </div>
  );
};

export default JobDetail;