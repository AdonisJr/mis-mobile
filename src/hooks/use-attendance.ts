import { useEffect, useState } from 'react';

import { fetchAttendanceMonth } from '@/api/attendance';
import { readErrorMessage } from '@/api/client';
import type { AttendanceMonthResponse } from '@/types/attendance';

export const ATTENDANCE_EMPTY_MESSAGE = 'No attendance records for this month.';
const ATTENDANCE_LOAD_FAILED_MESSAGE = 'Could not load attendance.';
const MONTHS_PER_YEAR = 12;

type LoadRequest = { month: string | null; sequence: number };

function shiftMonth(month: string, offset: number): string {
  const [year, monthNumber] = month.split('-').map(Number);
  const monthIndex = year * MONTHS_PER_YEAR + (monthNumber - 1) + offset;
  const shiftedYear = Math.floor(monthIndex / MONTHS_PER_YEAR);
  const shiftedMonth = String((monthIndex % MONTHS_PER_YEAR) + 1).padStart(2, '0');
  return `${shiftedYear}-${shiftedMonth}`;
}

export function useAttendance() {
  const [attendance, setAttendance] = useState<AttendanceMonthResponse | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadRequest, setLoadRequest] = useState<LoadRequest>({ month: null, sequence: 0 });

  useEffect(() => {
    let isCancelled = false;

    async function loadAttendance() {
      try {
        const monthResponse = await fetchAttendanceMonth(loadRequest.month);
        if (isCancelled) return;
        setAttendance(monthResponse);
        setErrorMessage(null);
        if (loadRequest.month === null) setCurrentMonth(monthResponse.month);
      } catch (error) {
        if (isCancelled) return;
        setErrorMessage(readErrorMessage(error, ATTENDANCE_LOAD_FAILED_MESSAGE));
      }
      setIsLoading(false);
      setIsRefreshing(false);
    }
    void loadAttendance();

    return () => {
      isCancelled = true;
    };
  }, [loadRequest]);

  const selectedMonth = loadRequest.month ?? attendance?.month ?? null;
  const canSelectNextMonth =
    selectedMonth !== null && currentMonth !== null && selectedMonth < currentMonth;

  function requestMonth(month: string) {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadRequest((current) => ({ month, sequence: current.sequence + 1 }));
  }

  function selectPreviousMonth() {
    if (selectedMonth === null) return;
    requestMonth(shiftMonth(selectedMonth, -1));
  }

  function selectNextMonth() {
    if (selectedMonth === null || !canSelectNextMonth) return;
    requestMonth(shiftMonth(selectedMonth, 1));
  }

  function reload() {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadRequest((current) => ({ ...current, sequence: current.sequence + 1 }));
  }

  function refresh() {
    setIsRefreshing(true);
    setLoadRequest((current) => ({ ...current, sequence: current.sequence + 1 }));
  }

  return {
    attendance,
    selectedMonth,
    errorMessage,
    isLoading,
    isRefreshing,
    canSelectNextMonth,
    selectPreviousMonth,
    selectNextMonth,
    reload,
    refresh,
  };
}
