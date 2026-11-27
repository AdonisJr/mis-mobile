import { useEffect, useState } from 'react';

import { readErrorMessage } from '@/api/client';
import { fetchGrades } from '@/api/grades';
import type { GradesResponse, SubjectGradeRow } from '@/types/grades';

export const GRADES_EMPTY_MESSAGE = 'No submitted grades yet.';
const GRADES_LOAD_FAILED_MESSAGE = 'Could not load grades.';

type LoadRequest = { schoolYearId: number | null; sequence: number };

function hasSubmittedQuarter(row: SubjectGradeRow): boolean {
  return row.quarters.some((quarterGrade) => quarterGrade.grade !== null);
}

export function useGrades() {
  const [grades, setGrades] = useState<GradesResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadRequest, setLoadRequest] = useState<LoadRequest>({ schoolYearId: null, sequence: 0 });

  useEffect(() => {
    let isCancelled = false;

    async function loadGrades() {
      try {
        const gradesResponse = await fetchGrades(loadRequest.schoolYearId);
        if (isCancelled) return;
        setGrades(gradesResponse);
        setErrorMessage(null);
      } catch (error) {
        if (isCancelled) return;
        setErrorMessage(readErrorMessage(error, GRADES_LOAD_FAILED_MESSAGE));
      }
      setIsLoading(false);
      setIsRefreshing(false);
    }
    void loadGrades();

    return () => {
      isCancelled = true;
    };
  }, [loadRequest]);

  function selectSchoolYear(schoolYearId: number) {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadRequest((current) => ({ schoolYearId, sequence: current.sequence + 1 }));
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
    grades,
    errorMessage,
    isLoading,
    isRefreshing,
    hasSubmittedGrades: grades?.subjects.some(hasSubmittedQuarter) ?? false,
    selectSchoolYear,
    reload,
    refresh,
  };
}
