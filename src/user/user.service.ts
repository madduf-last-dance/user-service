import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import * as bcrypt from "bcrypt";
import { UpdateCredentialsDto } from "./dto/update-credentials.dto";

@Injectable()
export class UserService {
  constructor(
    @Inject("RESERVATION_SERVICE") private readonly reservationClient:
      ClientProxy,
    @Inject("ACCOMMODATION_SERVICE") private readonly accommodationClient:
      ClientProxy,
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

  async findOneId(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne(
      { where: { id } },
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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
    return this.usersRepository.save(updatedUser);
  }
  async updateCredentials(updateUserDto: UpdateCredentialsDto) {
    let user = await this.usersRepository.findOne({ where: { id: updateUserDto.id } });
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
    user.username = updateUserDto.username;
    user.password = await bcrypt.hash(updateUserDto.password, 10);
    console.log(user);
    return this.usersRepository.save(user);
  }

  removeGuest(id: number) {
    if (this.reservationClient.send<boolean>("hasActiveReservations", id)) {
      throw new RpcException(
        "User cannot be deleted because he has active reservations in future",
      );
    }
    return this.usersRepository.delete(id);
  }

  removeHost(id: number) {
    if (this.reservationClient.send<boolean>("hasFutureReservations", id)) {
      throw new RpcException(
        "User cannot be deleted because he has future reservations for his accommodations",
      );
    }
    this.accommodationClient.send<any>("deleteHostAccommodations", id);
    return this.usersRepository.delete(id);
  }

}
