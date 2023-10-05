import { Service } from "typedi";
import { JsonController, Get, Param, QueryParams, HeaderParam } from "routing-controllers";
import { GetAllTopicQueryParams } from "./TopicController.dto";
import { TopicDomain } from "../domains/topic/topic.domain";

@Service()
@JsonController("/v1/topics")
export class TopicController {
  constructor(private topicDomain: TopicDomain) {}

  @Get("/")
  getAllTopic(@QueryParams() query: GetAllTopicQueryParams, @HeaderParam('language', { required: false }) language: string = 'th') {
    return this.topicDomain.findAll(query, language);
  }
}
