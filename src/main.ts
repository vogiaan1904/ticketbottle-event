import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerService } from '@shared/services/logger.service';
import { AppConfigService } from '@shared/services/config.service';
import { setupSwagger } from './shared/swagger/setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);
  const logger = app.get(LoggerService);

  app.useLogger(logger);

  app.setGlobalPrefix(configService.appConfig.globalPrefix || 'api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const corsOriginsRaw = configService.appConfig.corsOrigins;
  const corsOrigins =
    typeof corsOriginsRaw === 'string'
      ? corsOriginsRaw
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean)
      : ['http://localhost:3000'];

  app.enableCors({ origin: corsOrigins, credentials: true });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const port = configService.appConfig.port || 3000;

  await app.listen(port);
  logger.log(
    `Application is running on: http://localhost:${port}/${configService.appConfig.globalPrefix || 'api'}`,
  );
  if (['development', 'staging'].includes(configService.nodeEnv)) {
    setupSwagger(app, configService.swaggerConfig);
    logger.info(
      `See the API docs on: http://localhost:${port}/${configService.appConfig.globalPrefix || 'api'}/docs`,
    );
  }
}

bootstrap();
