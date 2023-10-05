import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export interface IUser {
  userId: number;
  username: string;
  fullname: string;
  email: string;
  avatar?: string;
  deleted: boolean;
}

@Entity()
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  @Exclude()
  password!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  fullname!: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  avatar?: string;

  @Column({ type: "boolean", default: false })
  @Exclude()
  deleted!: boolean;
}
