import { Service } from "typedi";
import {
  JsonController,
  Get,
  // QueryParams,
  HeaderParam,
  QueryParam,
  Param,
  Post,
  Put,
  Body,
} from "routing-controllers";
import {
  GetAllTopicQueryParams,
  TopicCommentRequest,
  TopicRequest,
  TopicStatusRequest,
} from "./TopicController.dto";
import { TopicDomain } from "../domains/topic/topic.domain";
import { TopicCategory, TopicStatus } from "../entities/Topic";
import { IUser } from "../entities/User";

@Service()
@JsonController("/v1/topics")
export class TopicController {
  constructor(private topicDomain: TopicDomain) {}

  @Get("/")
  getAllTopic(
    @HeaderParam("language", { required: false }) language: string,
    @QueryParam("category") category: TopicCategory,
    @QueryParam("createdBy") createdBy: IUser,
    @QueryParam("createdAtStart") createdAtStart: Date,
    @QueryParam("createdAtEnd") createdAtEnd: Date,
    @QueryParam("status") status: TopicStatus,
    @QueryParam("archive") archive: boolean = false,
    @QueryParam("page") page: number,
    @QueryParam("perPage") perPage: number
    // @QueryParams() query: GetAllTopicQueryParams
  ) {
    const query: GetAllTopicQueryParams = {
      category,
      createdBy,
      createdAtStart,
      createdAtEnd,
      status,
      archive,
      page,
      perPage,
    };

    return this.topicDomain.findAll(query, language);
  }

  @Get("/:topicId")
  getTopic(
    @HeaderParam("language", { required: false }) language: string,
    @Param("topicId") topicId: number
  ) {
    return this.topicDomain.findByTopicId(topicId, language);
  }

  @Post("/")
  createTopic(
    @HeaderParam("language", { required: false }) language: string,
    @HeaderParam("userId", { required: true }) userId: number,
    @Body() request: TopicRequest
  ) {
    return this.topicDomain.createTopic(userId, request, language);
  }

  @Put("/:topicId")
  updateTopic(
    @HeaderParam("language", { required: false }) language: string,
    @HeaderParam("userId", { required: true }) userId: number,
    @Param("topicId") topicId: number,
    @Body() request: TopicRequest
  ) {
    return this.topicDomain.updateTopic(topicId, userId, request, language);
  }

  @Put("/:topicId/status")
  updateStatusTopic(
    @HeaderParam("language", { required: false }) language: string,
    @HeaderParam("userId", { required: true }) userId: number,
    @Param("topicId") topicId: number,
    @Body() request: TopicStatusRequest
  ) {
    return this.topicDomain.updateTopic(topicId, userId, request, language);
  }

  @Post("/:topicId/comment")
  commentTopic(
    @HeaderParam("language", { required: false }) language: string,
    @HeaderParam("userId", { required: true }) userId: number,
    @Param("topicId") topicId: number,
    @Body() request: TopicCommentRequest
  ) {
    return this.topicDomain.commentTopic(topicId, userId, request, language);
  }

  @Post("/:topicId/archive")
  archiveTopic(
    @HeaderParam("language", { required: false }) language: string,
    @HeaderParam("userId", { required: true }) userId: number,
    @Param("topicId") topicId: number
  ) {
    return this.topicDomain.archiveTopic(topicId, userId, language);
  }
}
