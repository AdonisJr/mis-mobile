import { requestJson } from '@/api/client';
import type { GradesPayload, GradesResponse } from '@/types/grades';

function toGradesResponse(payload: GradesPayload): GradesResponse {
  return {
    school_year: payload.school_year,
    school_years: payload.school_years,
    subjects: payload.report_card?.subjects ?? [],
    general_averages: payload.report_card?.general_averages ?? [],
  };
}

export async function fetchGrades(schoolYearId: number | null): Promise<GradesResponse> {
  const query = schoolYearId === null ? '' : `?school_year_id=${schoolYearId}`;
  const payload = await requestJson<GradesPayload>(`/mis/mobile/grades${query}`, { method: 'GET' });
  return toGradesResponse(payload);
}
