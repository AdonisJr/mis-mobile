import { useEffect, useState } from 'react';

import { readErrorMessage } from '@/api/client';
import { fetchMe } from '@/api/mobile-auth';
import type { MobileStudent } from '@/types/auth';

const PROFILE_LOAD_FAILED_MESSAGE = 'Could not load your profile.';

export function useProfile() {
  const [student, setStudent] = useState<MobileStudent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sequence, setSequence] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadProfile() {
      try {
        const meResponse = await fetchMe();
        if (isCancelled) return;
        setStudent(meResponse.student);
        setErrorMessage(null);
      } catch (error) {
        if (isCancelled) return;
        setErrorMessage(readErrorMessage(error, PROFILE_LOAD_FAILED_MESSAGE));
      }
      setIsLoading(false);
    }
    void loadProfile();

    return () => {
      isCancelled = true;
    };
  }, [sequence]);

  function reload() {
    setIsLoading(true);
    setErrorMessage(null);
    setSequence((current) => current + 1);
  }

  return { student, errorMessage, isLoading, reload };
}
