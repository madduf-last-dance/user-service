import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

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

  @MessagePattern("removeUser")
  remove(@Payload() id: number) {
    return this.userService.remove(id);
  }
}
