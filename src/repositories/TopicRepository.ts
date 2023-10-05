import { Service } from "typedi";
import { FindManyOptions } from "typeorm";
import { Topic } from "../entities/Topic";
import { Comment } from "../entities/Comment";
import { AppDataSource } from "../database/mysql/AppDataSource";
import { ITopicRequest } from "../domains/topic/topic.interface";

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

  async findOneBy(request: {}): Promise<Topic | null> {
    return AppDataSource.getRepository(Topic).findOne({
      where: request,
      relations: ["createdBy", "comments", "comments.createdBy"],
    });
  }

  async createTopic(request: ITopicRequest) {
    return AppDataSource.getRepository(Topic).save(request);
  }

  async updateTopicByConditions(conditions: {}, request: ITopicRequest) {
    return AppDataSource.getRepository(Topic).update(conditions, request);
  }

  async commentTopic(request: Partial<Comment>) {
    return AppDataSource.getRepository(Comment).save(request);
  }
}
