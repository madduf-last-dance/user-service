import { Controller, NotFoundException } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Role } from "./entities/role.enum";
import { UpdateCredentialsDto } from "./dto/update-credentials.dto";
import { NotFoundError } from "rxjs";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern("createUser")
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern("findAllUser")
  findAll(@Payload() data: any) {
    return this.userService.findAll(data);
  }

  @MessagePattern("test")
  test() {
    return "test";
  }

  @MessagePattern("findOneUser")
  findOne(@Payload() username: string) {
    return this.userService.findOne(username);
  }

  @MessagePattern("updateUser")
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern("updateCredentials")
  updateCredentials(@Payload() updateUserDto: UpdateCredentialsDto) {
    return this.userService.updateCredentials(updateUserDto);
  }

  @MessagePattern("removeUser")
  async remove(@Payload() id: number) {
    const user = await this.userService.findOneId(id);
    if (user.role === Role.GUEST) {
      this.userService.removeGuest(user.id);
    } else if (user.role === Role.HOST) {
      this.userService.removeHost(user.id);
    }
  }
  @MessagePattern("profile")
  async profile(@Payload() id: any) {
    const user = await this.userService.findOneId(id);
    if(!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }
}
