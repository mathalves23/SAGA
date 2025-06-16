// src/hooks/useAuth.ts
// Este hook foi removido pois sua funcionalidade foi consolidada no AuthContext
// Agora usamos diretamente o useAuth exportado do AuthContext
// Isso evita duplicação de código e possíveis inconsistências

import { useAuth as useAuthFromContext } from '../context/AuthContext';

export const useAuth = useAuthFromContext;
