import { useAuth } from '../context/AuthContext';

export function useRol() {
  const { usuario } = useAuth();

  return {
    rol: usuario?.rol || null,
    authId: usuario?.auth_id || null,
    loading: false
  };
}