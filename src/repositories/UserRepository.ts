import { Service } from "typedi";
import { FindManyOptions, Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../database/mysql/AppDataSource";

@Service()
export class UserRepository extends Repository<User> {
  async findAll(queryOptions?: FindManyOptions<User>): Promise<User[]> {
    return AppDataSource.getRepository(User).find(queryOptions)
  }

  async findOneBy(request: {}): Promise<User | null> {
    return AppDataSource.getRepository(User).findOneBy(request);
  }
}
