import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import {
  IGetAllTopicQueryParams,
  ITopicCommentRequest,
  ITopicRequest,
} from "../domains/topic/topic.interface";
import { TopicCategory, TopicStatus } from "../entities/Topic";
import { IUser } from "../entities/User";

export class GetAllTopicQueryParams implements IGetAllTopicQueryParams {
  @IsOptional()
  @IsEnum(TopicCategory)
  category?: TopicCategory;

  @IsOptional()
  @IsString()
  createdBy?: IUser;

  @IsOptional()
  createdAtStart?: Date;

  @IsOptional()
  createdAtEnd?: Date;

  @IsOptional()
  @IsEnum(TopicStatus)
  status?: TopicStatus;

  @IsOptional()
  @IsBoolean()
  archive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  perPage?: number;
}

export class TopicRequest implements ITopicRequest {
  @IsNotEmpty()
  @IsString()
  description!: string;
}

export class TopicCommentRequest implements ITopicCommentRequest {
  @IsNotEmpty()
  @IsString()
  message!: string;
}

export class TopicStatusRequest implements ITopicRequest {
  @IsNotEmpty()
  @IsEnum(TopicStatus)
  status!: TopicStatus;
}
