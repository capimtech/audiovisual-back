// import {
//   Injectable,
//   OnApplicationBootstrap,
//   OnApplicationShutdown,
// } from '@nestjs/common';
// import { Redis } from 'ioredis';
// import { InvalidatedRefreshTokenError } from './invalidated-refresh-token-error';

// @Injectable()
// export class RefreshTokenIdsStorage
//   implements OnApplicationBootstrap, OnApplicationShutdown
// {
//   private redisClient: Redis;

//   onApplicationBootstrap() {
//     // TODO: Ideally, we should move this to the dedicated "RedisModule"
//     // instead of initiating the connection here.
//     this.redisClient = new Redis({
//       host: 'localhost', // NOTE: According to best practices, we should use the environment variables here instead.
//       port: 6379, // 👆
//     });
//   }

//   onApplicationShutdown(signal?: string) {
//     return this.redisClient.quit();
//   }

//   async insert(userId: string, tokenId: string): Promise<void> {
//     await this.redisClient.set(this.getKey(userId), tokenId);
//   }

//   async validate(userId: string, tokenId: string): Promise<boolean> {
//     const storedId = await this.redisClient.get(this.getKey(userId));
//     if (storedId !== tokenId) {
//       throw new InvalidatedRefreshTokenError();
//     }
//     return storedId === tokenId;
//   }

//   async invalidate(userId: string): Promise<void> {
//     await this.redisClient.del(this.getKey(userId));
//   }

//   private getKey(userId: string): string {
//     return `user-${userId}`;
//   }
// }
