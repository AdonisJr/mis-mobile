import { useAppearance } from '@/hooks/use-appearance';
import type { ResolvedScheme } from '@/types/appearance';

export function useColorScheme(): ResolvedScheme {
  return useAppearance().resolvedScheme;
}
