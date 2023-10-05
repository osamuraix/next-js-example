import i18n from "i18next";
import { Service } from "typedi";
import { Between } from "typeorm";
import { NotFoundError } from "../../middlewares/NotFoundError";
import { TopicRepository } from "../../repositories/TopicRepository";
import {
  IGetAllTopicQueryParams,
  ITopicCommentRequest,
  ITopicRequest,
} from "./topic.interface";
import { ITopic } from "../../entities/Topic";
import { UserRepository } from "../../repositories/UserRepository";

@Service()
export class TopicDomain {
  constructor(
    private topicRepo: TopicRepository,
    private userRepo: UserRepository
  ) {}

  async findAll(query: IGetAllTopicQueryParams, language: string) {
    try {
      const [data, total] = await this.topicRepo.findAll(
        this.buildPayload(query)
      );

      const mappingResponse = data.map((topic) =>
        this.mappingResponse(topic, language)
      );
      return { data: mappingResponse, total };
    } catch (err) {
      throw err;
    }
  }

  private buildPayload(query: IGetAllTopicQueryParams) {
    const { page = 1, perPage = 3, ...queryParams } = query;
    const skip = (page - 1) * perPage;

    const where: Record<string, any> = { ...queryParams };

    if (queryParams.createdAtStart || queryParams.createdAtEnd) {
      where.createdAt = Between(query.createdAtStart, query.createdAtEnd);

      delete where.createdAtStart;
      delete where.createdAtEnd;
    }

    return {
      where,
      skip,
      take: perPage,
    };
  }

  private mappingResponse(data: ITopic, language: string) {
    return {
      ...data,
      category: i18n.t(`topicCategory.${data.category}`, {
        lng: language,
      }),
      status: i18n.t(`topicStatus.${data.status}`, {
        lng: language,
      }),
    };
  }

  async findByTopicId(topicId: number, language: string) {
    try {
      const data = await this.topicRepo.findOneBy({ topicId });

      if (!data) {
        throw new NotFoundError("Topic not found");
      }

      return this.mappingResponse(data, language);
    } catch (err) {
      throw err;
    }
  }

  async findUserByUserId(userId: number) {
    try {
      const user = await this.userRepo.findOneBy({ userId });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  async createTopic(userId: number, request: ITopicRequest, language: string) {
    try {
      const user = await this.findUserByUserId(userId);
      const data = await this.topicRepo.createTopic({
        ...request,
        createdBy: user,
        createdAt: new Date(),
      });

      return this.mappingResponse(data, language);
    } catch (err) {
      throw err;
    }
  }

  async updateTopic(
    topicId: number,
    userId: number,
    request: ITopicRequest,
    language: string
  ) {
    try {
      const user = await this.findUserByUserId(userId);
      const updateResult = await this.topicRepo.updateTopicByConditions(
        {
          topicId,
          createdBy: user,
        },
        {
          ...request,
          updatedAt: new Date(),
        }
      );

      if (updateResult.affected && updateResult.affected > 0) {
        const data = await this.topicRepo.findOneBy({ topicId });

        return this.mappingResponse(data!, language);
      } else {
        throw new NotFoundError("Topic not found");
      }
    } catch (err) {
      throw err;
    }
  }

  async commentTopic(
    topicId: number,
    userId: number,
    request: ITopicCommentRequest,
    language: string
  ) {
    try {
      const [user] = await Promise.all([
        this.findUserByUserId(userId),
        this.findByTopicId(topicId, language),
      ]);

      await this.topicRepo.commentTopic({
        ...request,
        topicId,
        createdBy: user,
        createdAt: new Date(),
      });

      return await this.findByTopicId(topicId, language);
    } catch (err) {
      throw err;
    }
  }

  async archiveTopic(topicId: number, userId: number, language: string) {
    try {
      const request = {
        archive: true,
      };

      return await this.updateTopic(topicId, userId, request, language);
    } catch (err) {
      throw err;
    }
  }
}
