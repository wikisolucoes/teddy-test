import { useAuthContext } from '../contexts/AuthContext/AuthContext';

export function useAuth() {
  return useAuthContext();
}

