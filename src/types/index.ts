export interface AppData {
  name: string;
  submitted: string;
  status: string;
  id: string;
}

export interface ReviewData {
  name: string;
  school: string;
  degree: string;
  codingProfiles: string;
  essay1: string;
  essay2: string;
  resume: string;
}

// Extended types for the new API
declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    }
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    role: string;
  }
}

export interface Application {
  id: string;
  applicant_name: string;
  country: string;
  degree: string;
  school: string;
  codeforces_handle: string;
  leetcode_handle: string;
  resume_url: string;
  essay_about_you: string;
  essay_why_a2sv: string;
  status: string;
  student_id: string;
  submitted_at: string;
  updated_at: string;
}
