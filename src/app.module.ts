import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './modules/events/events.module';
import { SharedModule } from './shared.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppConfigService } from './shared/services/config.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerMiddleware } from './common/middlewares/logging.middleware';

@Module({
  imports: [
    SharedModule,
    EventsModule,
    PrismaModule,
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
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
