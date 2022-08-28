import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RouterModule.register([
      {
        path: 'v1',
        children: [
          {
            path: 'users',
            module: UsersModule,
            children: [
              {
                path: 'auth',
                module: AuthModule,
              },
            ],
          },
        ],
      },
    ]),
  ],
})
export class V1Module {}
