import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { UserModule } from "src/user/user.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "3600s" },
    }),
    ClientsModule.register([
      {
        name: "RESERVATION_SERVICE",
        transport: Transport.TCP,
        options: {
          port: 1315,
        },
      },
      {
        name: "ACCOMMODATION_SERVICE",
        transport: Transport.TCP,
        options: {
          host: "accommodation-service",
          port: 1312,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
