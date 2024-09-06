import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { register } from "module";
import { Role } from "src/user/entities/role.enum";
import { CreateUserDto } from "src/user/dto/create-user.dto";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("login")
  signIn(@Payload() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
  @MessagePattern("registerHost")
  registerHost(@Payload() registerDto: CreateUserDto) {
    registerDto.role = Role.HOST;
    return this.authService.register(registerDto);
  }
  @MessagePattern("registerGuest")
  registerGuest(@Payload() registerDto: CreateUserDto) {
    registerDto.role = Role.GUEST;
    return this.authService.register(registerDto);
  }
  //
  // @MessagePattern("createAuth")
  // create(@Payload() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }
  //
  // @MessagePattern("findAllAuth")
  // findAll() {
  //   return this.authService.findAll();
  // }
  //
  // @MessagePattern("findOneAuth")
  // findOne(@Payload() id: number) {
  //   return this.authService.findOne(id);
  // }
  //
  // @MessagePattern("updateAuth")
  // update(@Payload() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(updateAuthDto.id, updateAuthDto);
  // }
  //
  // @MessagePattern("removeAuth")
}
