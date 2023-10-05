import { ITopic, TopicCategory, TopicStatus } from "../../entities/Topic";
import { IUser } from "../../entities/User";

export interface IGetAllTopicQueryParams {
  category?: TopicCategory;
  createdBy?: IUser;
  createdAtStart?: Date;
  createdAtEnd?: Date;
  status?: TopicStatus;
  page?: number;
  perPage?: number;
  archive?: boolean;
}

export interface ITopicRequest {
  description?: string;
  createdBy?: IUser;
  createdAt?: Date;
  updatedAt?: Date;
  archive?: boolean;
  status?: TopicStatus;
}

export interface ITopicCommentRequest {
  message: string;
  createdBy?: IUser;
  createdAt?: Date;
}
