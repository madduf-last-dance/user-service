import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./entities/user.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
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
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
