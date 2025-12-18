import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { ROUTES } from '../../../constants/routes.constants';



interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
}


export function Header({ userName = 'Usuário', onLogout }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">teddy open finance</span>
          </div>

          <nav className="flex gap-6 items-center">
            <Link
              to={ROUTES.DASHBOARD || '/dashboard'}
              className="text-sm font-medium hover:text-orange-500 transition-colors data-[active=true]:text-orange-500 data-[active=true]:underline"
            >
              Dashboard
            </Link>
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

          <div className="text-sm">
            Olá, <span className="font-bold">{userName}</span>!
          </div>
        </div>
      </div>
    </header>
  );
}
