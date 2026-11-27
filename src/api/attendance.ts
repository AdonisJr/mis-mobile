import { requestJson } from '@/api/client';
import type { AttendanceMonthResponse } from '@/types/attendance';

export async function fetchAttendanceMonth(month: string | null): Promise<AttendanceMonthResponse> {
  const query = month === null ? '' : `?month=${month}`;
  return requestJson<AttendanceMonthResponse>(`/mis/mobile/attendance${query}`, { method: 'GET' });
}
