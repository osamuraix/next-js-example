import { IsBoolean, IsOptional, IsString } from "class-validator";
import { IGetAllUserQueryParams } from "../domains/user/user.interface";

export class GetAllUserQueryParams implements IGetAllUserQueryParams {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
