import { Injectable } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "src/user/entities/role.enum";

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const checkedUsers = await this.userRepository.find();
    if (checkedUsers.length > 0) {
      return;
    }

    const users: Partial<User>[] = [
      {
        username: "nikola",
        password: await bcrypt.hash("123", 10),
        name: "Nikola",
        surname: "Petrovic",
        email: "s.nino.petrovic@gmail.com",
        address: "Zrenjanin",
        role: Role.HOST,
      },
      {
        username: "crazyAca",
        password: await bcrypt.hash("vranje", 10),
        name: "Coa",
        surname: "Jovanovic",
        email: "aca.faca@vranje.com",
        address: "Pemina kuca",
        role: Role.GUEST,
      },
    ];
    await this.userRepository.save(users);
  }
}
