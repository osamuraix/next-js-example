import { mock, mockReset } from "jest-mock-extended";
import { UserRepository } from "../../repositories/UserRepository";
import { UserDomain } from "./user.domain";
import { IUser, User } from "../../entities/User";

describe("User domain", () => {
  const mockUserRepository = mock<UserRepository>();
  const domain = new UserDomain(mockUserRepository);

  beforeEach(() => {
    mockReset(mockUserRepository);
  });

  describe("Get User", () => {
    it("should get all users successfully", async () => {
      mockUserRepository.findAll.mockResolvedValue([
        mockUserResponse,
      ] as User[]);

      const result = await domain.findAll({});

      expect(mockUserRepository.findAll).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual([mockUserResponse]);
    });

    it("should get all users successfully with query params", async () => {
      mockUserRepository.findAll.mockResolvedValue([
        mockUserResponse,
      ] as User[]);

      const result = await domain.findAll({
        username: "mock-username",
        fullname: "mock-fullname",
        email: "mock-email",
      });

      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        where: {
          username: "mock-username",
          fullname: "mock-fullname",
          email: "mock-email",
        },
      });
      expect(result).toEqual([mockUserResponse]);
    });

    it("should get all users not found with query params", async () => {
      mockUserRepository.findAll.mockResolvedValue([] as User[]);

      const result = await domain.findAll({
        username: "mock-username",
        fullname: "mock-fullname",
        email: "mock-email",
        deleted: true,
      });

      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        where: {
          username: "mock-username",
          fullname: "mock-fullname",
          email: "mock-email",
          deleted: true,
        },
      });
      expect(result).toEqual([]);
    });

    it("should get user by userId successfully", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUserResponse as User);

      const result = await domain.findByUserId(1);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ userId: 1 });
      expect(result).toEqual(mockUserResponse);
    });
  });
});

const mockUserResponse: IUser = {
  userId: 1,
  username: "mock-username",
  fullname: "mock-fullname",
  email: "mock-email",
  avatar: "mock-avatar",
  deleted: false,
};
