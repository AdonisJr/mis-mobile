import type { NamedRef } from '@/types/auth';

export type QuarterGrade = { quarter: number; grade: number | null };

export type SubjectGradeRow = {
  curriculum_entry_id: number;
  term_number: number | null;
  subject: { id: number; code: string; name: string };
  quarters: QuarterGrade[];
  final_grade: number | null;
  remarks: 'Passed' | 'Failed' | null;
};

export type GeneralAverage = {
  term_number: number | null;
  average: string | null;
  rounded_average: number | null;
  descriptor: string | null;
};

export type GradesResponse = {
  school_year: NamedRef | null;
  subjects: SubjectGradeRow[];
  general_averages: GeneralAverage[];
  school_years: NamedRef[];
};

export type GradesPayload = {
  school_year: NamedRef | null;
  school_years: NamedRef[];
  report_card: { subjects: SubjectGradeRow[]; general_averages: GeneralAverage[] } | null;
};
