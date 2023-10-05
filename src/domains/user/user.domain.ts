import { Service } from "typedi";
import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { IGetAllUserQueryParams } from "./user.interface";

@Service()
export class UserDomain {
  constructor(private userRepo: UserRepository) {}

  async findAll(query: IGetAllUserQueryParams): Promise<User[]> {
    return this.userRepo.findAll({ where: query });
  }

  async findByUserId(userId: string): Promise<User | null> {
    return this.userRepo.findOneBy({ userId });
  }
}
