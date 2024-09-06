import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject("RESERVATION_SERVICE") private readonly reservationClient:
      ClientProxy,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(username);
    if (!await bcrypt.compare(pass, user.password)) {
      throw new RpcException(
        new UnauthorizedException("Invalid username or password"),
      );
    }
    const payload = { sub: user.id, username: user.username, role:user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async register(
    dto: any,
  ) {
    let user = await this.userService.findOne(dto.username);
    if (user) {
      throw new RpcException("user already exists");
    }
    dto = {
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    };
    console.log(dto);
    return this.userService.create(dto);
  }
  async update(dto: any) {
    return this.userService.update(dto.id, dto);
  }
}
