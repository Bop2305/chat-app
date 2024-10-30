import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { CustomResponseInterceptor } from './common/CustomResponseInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from your Next.js app
    credentials: true, // Enable if you need to send cookies
  });

  // Use WebSockets with CORS support
  app.useWebSocketAdapter(new IoAdapter(app));

  app.useGlobalInterceptors(new CustomResponseInterceptor());

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
