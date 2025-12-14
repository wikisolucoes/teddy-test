/**
 * Header Component - Cabeçalho fixo da aplicação
 * Seguindo design-prompt.md: Logo, Menu e Saudação
 */

import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@teddy-monorepo/web/shared';
import { ROUTES } from '@teddy-monorepo/web/shared';
import { useAuth } from '@teddy-monorepo/web/feature-auth';

interface HeaderProps {
  userName?: string;
}

/**
 * Header fixo com logo, menu e saudação
 */
export function Header({ userName = 'Usuário' }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">teddy open finance</span>
          </div>

          {/* Menu */}
          <nav className="flex gap-6 items-center">
            <Link
              to={ROUTES.CLIENTS}
              className="text-sm font-medium hover:text-orange-500 transition-colors data-[active=true]:text-orange-500 data-[active=true]:underline"
            >
              Clientes
            </Link>
            <Link
              to={ROUTES.CLIENTS_SELECTED}
              className="text-sm font-medium hover:text-orange-500 transition-colors"
            >
              Clientes selecionados
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-sm font-medium"
            >
              Sair
            </Button>
          </nav>

          {/* Saudação */}
          <div className="text-sm">
            Olá, <span className="font-bold">{userName}</span>!
          </div>
        </div>
      </div>
    </header>
  );
}
