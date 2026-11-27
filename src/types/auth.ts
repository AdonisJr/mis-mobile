export type NamedRef = { id: number; name: string };

export type ApiUser = { id: number; name: string; email: string | null; roles: string[] };

export type MobileStudent = {
  id: number;
  lrn: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  grade_level: NamedRef | null;
  section: NamedRef | null;
  school_year: NamedRef | null;
};

export type LoginResponse = {
  token: string;
  user: ApiUser;
  student: MobileStudent;
  must_change_password: boolean;
};

export type MeResponse = { student: MobileStudent; must_change_password: boolean };

export type ApiErrorBody = { message?: string; errors?: Record<string, string[]> };
