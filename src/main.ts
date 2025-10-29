import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { SeedService } from "./seed/seed.service";
import { CustomRpcExceptionFilter } from "./filters/rpc-filter.filter";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        // host: 'localhost',
        host: "0.0.0.0",
        port: 1313,
      },
    },
  );
  await app.get(SeedService).seed();
  app.useGlobalFilters(new CustomRpcExceptionFilter());
  await app.listen();
}
bootstrap();
