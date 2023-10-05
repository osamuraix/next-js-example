import { Service } from "typedi";
import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../database/mysql/AppDataSource";
import { Topic } from "../entities/Topic";

@Service()
export class TopicRepository {
  async findAll(
    queryOptions?: FindManyOptions<Topic>
  ): Promise<[Topic[], number]> {
    return AppDataSource.getRepository(Topic).findAndCount({
      ...queryOptions,
      relations: ["createdBy"],
    });
  }
}
