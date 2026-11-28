export type AttendanceStatus = 'present' | 'late';

export type AttendanceDay = {
  id: number;
  date: string;
  time_in: string;
  time_out: string | null;
  status: AttendanceStatus;
};

export type AttendanceSummary = { present: number; late: number; absent: number };

export type AttendanceMonthResponse = {
  month: string;
  summary: AttendanceSummary;
  days: AttendanceDay[];
};
