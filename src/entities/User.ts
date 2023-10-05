import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export interface IUser {
  userId: number;
  username: string;
  password: string;
  fullname: string;
  email: string;
  status: boolean;
}

@Entity()
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn()
  userId!: number;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  fullname!: string;

  @Column({ type: "varchar", length: 255, nullable: false, unique: true })
  email!: string;

  @Column({ type: "boolean", default: false, nullable: true })
  status!: boolean;
}
