import { RedisModule } from '@nestjs-modules/ioredis';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalGrpcExceptionFilter } from './common/filters/global-grpc-exception.filter';
import { InternalServiceJwtGuard } from './common/guards/internal-service-jwt.guard';
import { InternalUserJwtGuard } from './common/guards/internal-user-jwt.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { TransformInterceptor } from './common/interceptors/transfrom.interceptor';
import { LoggerMiddleware } from './common/middlewares/logging.middleware';
import { EventsModule } from './modules/events/events.module';
import { SharedModule } from './shared.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AppConfigService } from './shared/services/config.service';

@Module({
  imports: [
    SharedModule,
    EventsModule,
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: async (configService: AppConfigService) => {
        return {
          secret: configService.microservicesConfig.internalKey,
          signOptions: { expiresIn: '15m' },
        };
      },
      inject: [AppConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: AppConfigService) => {
        return {
          type: 'single',
          url: configService.redisConfig.url + '?family=0',
          // password: configService.get<string>('REDIS_PASSWORD') || undefined,
          options: {
            connectTimeout: 5000,
            maxRetriesPerRequest: 3,
          },
        };
      },
      inject: [AppConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalGrpcExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    { provide: APP_GUARD, useClass: InternalUserJwtGuard },
    InternalServiceJwtGuard,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
