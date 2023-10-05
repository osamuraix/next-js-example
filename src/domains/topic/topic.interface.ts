import { TopicCategory, TopicStatus } from "../../entities/Topic";
import { IUser } from "../../entities/User";

export interface IGetAllTopicQueryParams {
  category?: TopicCategory;
  createdBy?: IUser;
  createdAt?: Date;
  status?: TopicStatus;
  page?: number;
  perPage?: number;
}
