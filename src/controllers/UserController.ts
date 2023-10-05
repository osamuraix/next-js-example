import { Service } from "typedi";
import { JsonController, Get, Param, QueryParams } from 'routing-controllers';
import { UserDomain } from '../domains/user/user.domain';
import { GetAllUserQueryParams } from "./UserController.dto";

@Service()
@JsonController('/v1/users')
export class UserController {
  constructor(private userDomain: UserDomain) {}

  @Get('/')
  getAllUsers(@QueryParams() query: GetAllUserQueryParams) {
    return this.userDomain.findAll(query);
  }

  @Get('/:userId')
  getUser(@Param('userId') userId: string) {
    return this.userDomain.findByUserId(userId);
  }
}
