import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async create(dto: CreateUserDto) {
    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }

  findAll(data: any) {
    return data;
  }
  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne(
      { where: { username } },
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    let user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new RpcException("User not found");
    }
    if (user.username !== updateUserDto.username) {
      user = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (user) {
        throw new RpcException("User with this username already exists");
      }
    }
    let updatedUser = Object.assign(user, updateUserDto);
    return "";
    // return this.usersRepository.save(updatedUser);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
