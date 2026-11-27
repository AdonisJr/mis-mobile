import * as Device from 'expo-device';

import { requestJson } from '@/api/client';
import type { LoginResponse, MeResponse } from '@/types/auth';

const MOBILE_PATH = '/mis/mobile';
const DEVICE_NAME_FALLBACK = 'mis-mobile';

export function loginStudent(lrn: string, password: string): Promise<LoginResponse> {
  const deviceName = Device.modelName ?? DEVICE_NAME_FALLBACK;
  return requestJson<LoginResponse>(`${MOBILE_PATH}/login`, {
    method: 'POST',
    body: JSON.stringify({ lrn, password, device_name: deviceName }),
  });
}

export function fetchMe(): Promise<MeResponse> {
  return requestJson<MeResponse>(`${MOBILE_PATH}/me`, { method: 'GET' });
}

export function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return requestJson<void>(`${MOBILE_PATH}/password`, {
    method: 'PUT',
    body: JSON.stringify({
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPassword,
    }),
  });
}

export function logoutStudent(): Promise<void> {
  return requestJson<void>(`${MOBILE_PATH}/logout`, { method: 'POST' });
}
