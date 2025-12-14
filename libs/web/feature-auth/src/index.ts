// Context & Hooks
export { AuthProvider, useAuthContext } from './lib/presentation/contexts/AuthContext/AuthContext';
export { useAuth } from './lib/presentation/hooks/useAuth';

// Guards
export { ProtectedRoute } from './lib/presentation/guards/ProtectedRoute';

// Pages
export { LoginPage } from './lib/presentation/pages/Login/LoginPage';

// Types
export type { User } from './lib/domain/entities/user.entity';
export type { LoginDto, AuthResponse } from './lib/application/dtos/auth.dto';
