// Client-side API functions for user management

interface UpdateUserData {
  full_name?: string;
  email?: string;
  password?: string;
  role?: string;
  is_active?: boolean;
}

interface CreateUserData {
  full_name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
}

export async function updateUserClient(userId: string, userData: UpdateUserData) {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.status}`);
  }

  return response.json();
}

export async function deleteUserClient(userId: string) {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status}`);
  }

  return response.json();
}

export async function createUserClient(userData: CreateUserData) {
  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`);
  }

  return response.json();
}

// Cycle Management Functions
interface CreateCycleData {
  name: string;
  start_date: string;
  end_date: string;
  description: string;
}

interface UpdateCycleData {
  name?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export async function createCycleClient(cycleData: CreateCycleData) {
  const response = await fetch('/api/admin/cycles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cycleData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create cycle: ${response.status}`);
  }

  return response.json();
}

export async function updateCycleClient(cycleId: number, cycleData: UpdateCycleData) {
  const response = await fetch(`/api/admin/cycles/${cycleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cycleData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update cycle: ${response.status}`);
  }

  return response.json();
}

export async function activateCycleClient(cycleId: number) {
  const response = await fetch(`/api/admin/cycles/${cycleId}/activate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to activate cycle: ${response.status}`);
  }

  return response.json();
}

export async function deleteCycleClient(cycleId: number) {
  const response = await fetch(`/api/admin/cycles/${cycleId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete cycle: ${response.status}`);
  }

  return response.json();
}
