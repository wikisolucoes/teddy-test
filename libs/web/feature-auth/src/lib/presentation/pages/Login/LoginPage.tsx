import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from '../../components/forms/LoginForm/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from '@teddy-monorepo/web/shared';
import { useToast } from '@teddy-monorepo/web/shared';
import type { LoginDto } from '../../../application/dtos/auth.dto';
import { useEffect } from 'react';

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (data: LoginDto) => {
    try {
      await login(data.email, data.password);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo de volta!',
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: error instanceof Error ? error.message : 'Credenciais inválidas',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">teddy open finance</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}

