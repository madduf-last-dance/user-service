import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { ClientProxy, RpcException } from "@nestjs/microservices";

@Injectable()
export class UserService {
  constructor(
    @Inject("RESERVATION_SERVICE") private readonly reservationClient:
      ClientProxy,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async create(dto: CreateUserDto) {
    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    if (this.reservationClient.send<boolean>("hasActiveReservations", id)) {
      throw new RpcException(
        "User cannot be deleted because he has active reservations in future",
      );
    }
    return this.usersRepository.delete(id);
  }
}
