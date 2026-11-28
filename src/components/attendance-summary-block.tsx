import { Card } from '@/components/ui/card';
import { KpiRow, type KpiItem } from '@/components/ui/kpi-row';
import type { AttendanceSummary } from '@/types/attendance';

export function buildSummaryKpis(summary: AttendanceSummary): KpiItem[] {
  return [
    { label: 'Present', value: String(summary.present) },
    { label: 'Late', value: String(summary.late) },
    { label: 'Absent', value: String(summary.absent) },
  ];
}

export function countRecordedDays(summary: AttendanceSummary): number {
  return summary.present + summary.late + summary.absent;
}

export function AttendanceSummaryBlock({ summary }: { summary: AttendanceSummary }) {
  return (
    <Card>
      <KpiRow items={buildSummaryKpis(summary)} />
    </Card>
  );
}
