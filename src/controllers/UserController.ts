import { Service } from "typedi";
import {
  JsonController,
  Get,
  Param,
  // QueryParams,
  QueryParam,
} from "routing-controllers";
import { UserDomain } from "../domains/user/user.domain";
import { GetAllUserQueryParams } from "./UserController.dto";

@Service()
@JsonController("/v1/users")
export class UserController {
  constructor(private userDomain: UserDomain) {}

  @Get("/")
  getAllUsers(
    @QueryParam("username") username: string,
    @QueryParam("fullname") fullname: string,
    @QueryParam("email") email: string,
    @QueryParam("deleted") deleted: boolean
    // @QueryParams() query: GetAllUserQueryParams
  ) {
    const query: GetAllUserQueryParams = {
      username,
      fullname,
      email,
      deleted,
    };

    return this.userDomain.findAll(query);
  }

  @Get("/:userId")
  getUser(@Param("userId") userId: string) {
    return this.userDomain.findByUserId(userId);
  }
}
