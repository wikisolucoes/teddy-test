import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

/**
 * Extrai usuário autenticado do request
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  }
);

/**
 * Marca rota como pública (não requer autenticação)
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => {
  const { SetMetadata } = require('@nestjs/common');
  return SetMetadata(IS_PUBLIC_KEY, true);
};
