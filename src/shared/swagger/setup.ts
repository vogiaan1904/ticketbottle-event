import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { ISwaggerConfigInterface } from '@/shared/interfaces/swagger-config.interface';
export function setupSwagger(app: INestApplication, config: ISwaggerConfigInterface) {
  const options = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description || '')
    .setVersion(config.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    // .addServer(`${config.scheme}://${config.path}`)
    .addSecurityRequirements('jwt')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const theme = new SwaggerTheme();

  SwaggerModule.setup(config.path || 'docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK),
  });
}
