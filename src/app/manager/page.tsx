import ManagerDashboard from "../../components/ManagerDashboard";
const BASE_URL = "https://a2sv-application-platform-backend-team5.onrender.com";

export default async function Page() {
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMWE3YWYzZC1mOWMzLTQzYWQtYWFkYy01N2EzNGFkZmU3NzciLCJleHAiOjE3NTQ1OTg2NjcsInR5cGUiOiJhY2Nlc3MifQ.8xjntUhXds2dFkn7fdQhkRna9_LjPxcHirFkAwv7JPQ";
  const res = await fetch(BASE_URL + "/manager/applications/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    // Token expired or unauthorized
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-red-600">Unauthorized</h1>
        <p>
          Your session has expired. Please{" "}
          <a href="/login" className="underline text-blue-600">
            log in again
          </a>
          .
        </p>
      </div>
    );
  }

  if (!res.ok) {
    // Handle other errors
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-red-600">
          Error loading applications
        </h1>
        <p>Status: {res.status}</p>
      </div>
    );
  }

  const response = await res.json();

  const applications = response.data?.applications ?? [];

  return <ManagerDashboard applications={applications} />;
}
