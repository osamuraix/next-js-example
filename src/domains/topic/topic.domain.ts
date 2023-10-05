import { Service } from "typedi";
import { TopicRepository } from "../../repositories/TopicRepository";
import { IGetAllTopicQueryParams } from "./topic.interface";
import { ITopic } from "../../entities/Topic";
import i18n from "i18next";

@Service()
export class TopicDomain {
  constructor(private topicRepo: TopicRepository) {}

  async findAll(query: IGetAllTopicQueryParams, language: string) {
    try {
      const [data, total] = await this.topicRepo.findAll(
        this.buildPayload(query)
      );

      return { data: this.mappingResponse(data, language), total };
    } catch (err) {
      throw err;
    }
  }

  private buildPayload(query: IGetAllTopicQueryParams) {
    const { page = 1, perPage = 3, ...queryParams } = query;
    const skip = (page - 1) * perPage;

    return {
      where: queryParams,
      skip,
      take: perPage,
    };
  }

  private mappingResponse(data: ITopic[], language: string) {
    return data.map((topic) => ({
      ...topic,
      createdBy: topic.createdBy.username,
      category: i18n.t(`topicCategory.${topic.category}`, {
        lng: language,
      }),
      status: i18n.t(`topicStatus.${topic.status}`, {
        lng: language,
      }),
    }));
  }
}
