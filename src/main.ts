import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { SeedService } from "./seed/seed.service";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: 1313,
      },
    },
  );
  await app.get(SeedService).seed();
  await app.listen();
}
bootstrap();
