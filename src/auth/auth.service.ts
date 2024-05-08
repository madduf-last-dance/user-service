import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    console.log(username, pass);
    const user = await this.userService.findOne(username);
    console.log(user);
    if (user?.password !== pass) {
      throw new RpcException(
        new UnauthorizedException("Invalid username or password"),
      );
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
