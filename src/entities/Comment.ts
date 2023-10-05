import { Exclude } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { IUser, User } from "./User";
import { ITopic, Topic } from "./Topic";

export interface IComment {
  commentId: number;
  topicId: number;
  message: string;
  createdBy: IUser;
  createdAt: Date;
  deleted: boolean;
}

@Entity()
export class Comment extends BaseEntity implements IComment {
  @PrimaryGeneratedColumn()
  commentId!: number;

  @ManyToOne(() => Topic, (topic) => topic.topicId)
  topicId!: number;

  @Column({ type: "text", nullable: false })
  message!: string;

  @ManyToOne(() => User, (user) => user.username)
  createdBy!: User;

  @Column({ type: "datetime", nullable: false })
  createdAt!: Date;

  @Column({ type: "boolean", default: false })
  @Exclude()
  deleted!: boolean;
}
