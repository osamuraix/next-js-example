import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { IUser, User } from "./User";
import { Comment, IComment } from "./Comment";

export enum TopicCategory {
  INTERVIEW = "interview", // นัดสัมภาษณ์งาน
  ONBOARDING = "onboarding", // นัดเริ่มงาน
  MEETING = "meeting", // นัดประชุมงาน
}

export enum TopicStatus {
  TODO = "todo",
  INPROGRESS = "in_progress",
  DONE = "done",
}

export interface ITopic {
  topicId: number;
  category: TopicCategory;
  description?: string;
  createdBy: IUser;
  createdAt: Date;
  updatedAt?: Date;
  status: TopicStatus;
  archive: boolean;
  comments: IComment[];
}

@Entity()
export class Topic extends BaseEntity implements ITopic {
  @PrimaryGeneratedColumn()
  topicId!: number;

  @Column({
    type: "enum",
    enum: TopicCategory,
    default: TopicCategory.INTERVIEW,
  })
  category!: TopicCategory;

  @Column({ type: "text", nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.username)
  createdBy!: User;

  @Column({ type: "datetime", nullable: false })
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  updatedAt?: Date;

  @Column({ type: "enum", enum: TopicStatus, default: TopicStatus.TODO })
  status!: TopicStatus;

  @Column({ type: "boolean", default: false })
  archive!: boolean;

  @OneToMany(() => Comment, (comment) => comment.topicId)
  comments!: Comment[];
}
