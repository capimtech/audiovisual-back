import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ApiKeyAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-api-key'];
  },
);
