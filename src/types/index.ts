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
