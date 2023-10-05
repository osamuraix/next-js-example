import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { IGetAllTopicQueryParams } from "../domains/topic/topic.interface";
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
  @IsDateString()
  createdAt?: Date;

  @IsOptional()
  @IsEnum(TopicStatus)
  status?: TopicStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  perPage?: number;
}
