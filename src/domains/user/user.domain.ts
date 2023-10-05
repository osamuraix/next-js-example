import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { IUser } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { IGetAllUserQueryParams } from "./user.interface";

@Service()
export class UserDomain {
  constructor(private userRepo: UserRepository) {}

  async findAll(query: IGetAllUserQueryParams): Promise<IUser[]> {
    return this.userRepo.findAll({ where: query });
  }

  async findByUserId(userId: string) {
    const data = await this.userRepo.findOneBy({ userId });

    if (!data) {
      throw new NotFoundError("User not found");
    }

    return data;
  }
}
