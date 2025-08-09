import { NextRequest, NextResponse } from 'next/server';

// Mock users data for development/testing
const mockUsers = [
  {
    id: "1",
    full_name: "John Admin",
    email: "admin@example.com",
    role: "admin",
    profile_picture: "",
    is_active: true
  },
  {
    id: "2", 
    full_name: "Jane Reviewer",
    email: "jane@example.com",
    role: "reviewer",
    profile_picture: "",
    is_active: true
  },
  {
    id: "3",
    full_name: "Bob Manager", 
    email: "bob@example.com",
    role: "manager",
    profile_picture: "",
    is_active: false
  },
  {
    id: "4",
    full_name: "Alice Applicant",
    email: "alice@example.com", 
    role: "applicant",
    profile_picture: "",
    is_active: true
  }
];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: mockUsers,
    message: "Users fetched successfully (mock data)"
  });
}
