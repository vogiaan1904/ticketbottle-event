import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { LoggerService } from '@shared/services/logger.service';
import { join } from 'path';
import { AppModule } from './app.module';
import { EVENT_PACKAGE_NAME } from './protogen/event.pb';
import { GlobalGrpcExceptionFilter } from './common/filters/global-grpc-exception.filter';
import { RpcValidationException } from './common/exceptions/rpc-validation.exception';

async function bootstrap() {
  const HOST = process.env.HOST || '0.0.0.0';
  const PORT = process.env.GRPC_PORT || '50053';
  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${HOST}:${PORT}`,
      package: EVENT_PACKAGE_NAME,
      protoPath: 'src/protos/event.proto',
    },
  });

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        throw new RpcValidationException('Validation failed', errors);
      },
    }),
  );
  app.useGlobalFilters(new GlobalGrpcExceptionFilter(logger));
  await app.listen();
}

bootstrap();
