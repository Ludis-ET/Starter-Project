'use client';

import React from "react";

const BASE_URL = "https://a2sv-application-platform-backend-team5.onrender.com";

interface Props {
  slug: string;
  accessToken: string;
}

const ManagerActions = ({ slug, accessToken }: Props) => {
  const handleRejection = async () => {
    try {
      await fetch(`${BASE_URL}/manager/applications/${slug}/decide/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: "rejected",
          decision_notes: "NOt bad for a newb :)",
        }),
      });
      alert("Rejected successfully");
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const handleAccept = async () => {
    try {
      await fetch(`${BASE_URL}/manager/applications/${slug}/decide/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: "accepted",
          decision_notes: "Nice Job :)",
        }),
      });
      alert("Accepted successfully");
    } catch (err) {
      console.error("Accept failed", err);
    }
  };

  return (
    <div className="w-[300px] bg-white border rounded-xl shadow p-6 space-y-4 h-fit">
      <h2 className="text-xl font-semibold">Manager Actions</h2>

      {/* Reviewer Assignment */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Assign Reviewer</p>
        <div className="bg-gray-100 px-4 py-2 rounded-xl font-medium">
          Jane R.
        </div>
        <button className="mt-2 w-full bg-violet-700 text-white py-1 rounded hover:bg-violet-800 transition">
          Confirm
        </button>
      </div>

      <hr />

      {/* Final Decision */}
      <div>
        <h3 className="font-semibold">Final Decision</h3>
        <p className="text-sm text-gray-500 mb-3">
          This action is final and will notify the applicant.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleRejection}
            className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 bg-green-500 text-white py-1 rounded hover:bg-green-600 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerActions;
