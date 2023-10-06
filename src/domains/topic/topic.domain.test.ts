import i18n from "i18next";
import { mock, mockReset } from "jest-mock-extended";
import { TopicRepository } from "../../repositories/TopicRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { TopicDomain } from "./topic.domain";
import { IUser, User } from "../../entities/User";
import { Topic, TopicCategory, TopicStatus } from "../../entities/Topic";
import { IComment, Comment } from "../../entities/Comment";
import { Between, UpdateResult } from "typeorm";
import { NotFoundError } from "../../middlewares/NotFoundError";

describe("Topic domain", () => {
  const i18nT = jest.spyOn(i18n, "t");
  const mockTopicRepository = mock<TopicRepository>();
  const mockUserRepository = mock<UserRepository>();
  const domain = new TopicDomain(mockTopicRepository, mockUserRepository);

  beforeEach(() => {
    mockReset(i18nT);
    mockReset(mockTopicRepository);
    mockReset(mockUserRepository);
  });

  describe("Get Topic", () => {
    it("should get all topics successfully", async () => {
      i18nT.mockReturnValueOnce("นัดสัมภาษณ์งาน");
      i18nT.mockReturnValueOnce("กำลังรอ");

      mockTopicRepository.findAll.mockResolvedValue([
        [
          mockTopicResponse([mockCommentResponse(mockUserCommentResponse)]),
        ] as Topic[],
        10,
      ]);

      const result = await domain.findAll({}, "th");

      expect(mockTopicRepository.findAll).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 3,
      });
      expect(result).toEqual({
        data: [
          mockTopicResponseTranslation([
            mockCommentResponse(mockUserCommentResponse),
          ]),
        ],
        total: 10,
      });
    });

    it("should get all topics successfully with quest params", async () => {
      i18nT.mockReturnValueOnce("นัดสัมภาษณ์งาน");
      i18nT.mockReturnValueOnce("กำลังรอ");

      mockTopicRepository.findAll.mockResolvedValue([
        [
          mockTopicResponse([mockCommentResponse(mockUserCommentResponse)]),
        ] as Topic[],
        10,
      ]);

      const result = await domain.findAll(
        {
          category: TopicCategory.INTERVIEW,
          createdAtStart: new Date("2022-01-01T00:00:00.000Z"),
          createdAtEnd: new Date("2022-12-31T23:59:59.000Z"),
          status: TopicStatus.TODO,
          page: 1,
          perPage: 10,
        },
        "th"
      );

      expect(mockTopicRepository.findAll).toHaveBeenCalledWith({
        where: {
          category: TopicCategory.INTERVIEW,
          createdAt: Between(
            new Date("2022-01-01T00:00:00.000Z"),
            new Date("2022-12-31T23:59:59.000Z")
          ),
          status: TopicStatus.TODO,
        },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: [
          mockTopicResponseTranslation([
            mockCommentResponse(mockUserCommentResponse),
          ]),
        ],
        total: 10,
      });
    });

    it("should get all topic not found", async () => {
      mockTopicRepository.findAll.mockResolvedValue([[] as Topic[], 10]);

      const result = await domain.findAll({}, "th");

      expect(mockTopicRepository.findAll).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 3,
      });
      expect(result).toEqual({
        data: [],
        total: 10,
      });
    });

    it("should get topic by topicId successfully", async () => {
      i18nT.mockReturnValueOnce("นัดสัมภาษณ์งาน");
      i18nT.mockReturnValueOnce("กำลังรอ");

      mockTopicRepository.findOneBy.mockResolvedValue(
        mockTopicResponse([
          mockCommentResponse(mockUserCommentResponse),
        ]) as Topic
      );

      const result = await domain.findByTopicId(1, "th");

      expect(mockTopicRepository.findOneBy).toHaveBeenCalledWith({
        topicId: 1,
      });
      expect(result).toEqual(
        mockTopicResponseTranslation([
          mockCommentResponse(mockUserCommentResponse),
        ])
      );
    });
  });

  describe("Create / Update Topic", () => {
    const originalDate = Date;
    const fixedDate = new Date("2022-11-19T15:19:35.000Z");

    beforeAll(() => {
      jest.spyOn(global, "Date").mockImplementation(() => fixedDate);
    });

    afterAll(() => {
      global.Date = originalDate;
    });

    it("should create topic successfully", async () => {
      i18nT.mockReturnValueOnce("นัดสัมภาษณ์งาน");
      i18nT.mockReturnValueOnce("กำลังรอ");

      mockUserRepository.findOneBy.mockResolvedValue(mockUserResponse as User);
      mockTopicRepository.createTopic.mockResolvedValue(
        mockTopicResponse([]) as Topic
      );

      const result = await domain.createTopic(
        1,
        { description: "mock-description" },
        "th"
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ userId: 1 });
      expect(mockTopicRepository.createTopic).toHaveBeenCalledWith({
        description: "mock-description",
        createdBy: mockUserResponse,
        createdAt: new Date("2022-11-19T15:19:35.000Z"),
      });

      expect(result).toEqual(mockTopicResponseTranslation([]));
    });

    it("should create topic failed when User not found", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        domain.createTopic(99, { description: "mock-description" }, "th")
      ).rejects.toThrow(NotFoundError);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ userId: 99 });
    });

    it("should update topic successfully", async () => {
      i18nT.mockReturnValueOnce("นัดสัมภาษณ์งาน");
      i18nT.mockReturnValueOnce("กำลังรอ");

      mockUserRepository.findOneBy.mockResolvedValue(mockUserResponse as User);
      mockTopicRepository.updateTopicByConditions.mockResolvedValue({
        affected: 1,
      } as UpdateResult);

      mockTopicRepository.findOneBy.mockResolvedValue(
        mockTopicResponse([]) as Topic
      );

      const result = await domain.updateTopic(
        1,
        1,
        { description: "mock-description" },
        "th"
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ userId: 1 });
      expect(mockTopicRepository.updateTopicByConditions).toHaveBeenCalledWith(
        {
          topicId: 1,
          createdBy: mockUserResponse,
        },
        {
          description: "mock-description",
          updatedAt: new Date("2022-11-19T15:19:35.000Z"),
        }
      );
      expect(mockTopicRepository.findOneBy).toHaveBeenCalledWith({
        topicId: 1,
      });

      expect(result).toEqual(mockTopicResponseTranslation([]));
    });

    it("should update topic failed when User not found", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        domain.updateTopic(1, 99, { description: "mock-description" }, "th")
      ).rejects.toThrow(NotFoundError);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ userId: 99 });
    });

    it("should update topic failed when Topic not found", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUserResponse as User);
      mockTopicRepository.updateTopicByConditions.mockResolvedValue({
        affected: 0,
      } as UpdateResult);

      await expect(
        domain.updateTopic(99, 1, { description: "mock-description" }, "th")
      ).rejects.toThrow(NotFoundError);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ userId: 1 });
      expect(mockTopicRepository.updateTopicByConditions).toHaveBeenCalledWith(
        {
          topicId: 99,
          createdBy: mockUserResponse,
        },
        {
          description: "mock-description",
          updatedAt: new Date("2022-11-19T15:19:35.000Z"),
        }
      );
    });
  });

  describe("Comment Topic", () => {
    const originalDate = Date;
    const fixedDate = new Date("2022-11-20T15:19:35.000Z");

    beforeAll(() => {
      jest.spyOn(global, "Date").mockImplementation(() => fixedDate);
    });

    afterAll(() => {
      global.Date = originalDate;
    });

    it("should comment topic successfully", async () => {
      i18nT.mockReturnValueOnce("นัดสัมภาษณ์งาน");
      i18nT.mockReturnValueOnce("กำลังรอ");

      mockUserRepository.findOneBy.mockResolvedValue(
        mockUserCommentResponse as User
      );
      mockTopicRepository.findOneBy.mockResolvedValueOnce(
        mockTopicResponse([]) as Topic
      );

      i18nT.mockReturnValueOnce("นัดสัมภาษณ์งาน");
      i18nT.mockReturnValueOnce("กำลังรอ");

      mockTopicRepository.findOneBy.mockResolvedValueOnce(
        mockTopicResponse([
          mockCommentResponse(mockUserCommentResponse),
        ]) as Topic
      );

      const result = await domain.commentTopic(
        1,
        99,
        { message: "mock-message" },
        "th"
      );

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ userId: 99 });
      expect(mockTopicRepository.findOneBy).toHaveBeenCalledWith({
        topicId: 1,
      });
      expect(mockTopicRepository.commentTopic).toHaveBeenCalledWith({
        message: "mock-message",
        topicId: 1,
        createdBy: mockUserCommentResponse,
        createdAt: new Date("2022-11-20T15:19:35.000Z"),
      });
      expect(mockTopicRepository.findOneBy).toHaveBeenCalledWith({
        topicId: 1,
      });

      expect(result).toEqual(
        mockTopicResponseTranslation([
          mockCommentResponse(mockUserCommentResponse),
        ])
      );
    });

    it("should comment topic failed when User not found", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        domain.commentTopic(1, 999, { message: "mock-message" }, "th")
      ).rejects.toThrow(NotFoundError);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        userId: 999,
      });
    });

    it("should comment topic failed when Topic not found", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(
        mockUserCommentResponse as User
      );
      mockTopicRepository.findOneBy.mockResolvedValueOnce(null);

      await expect(
        domain.commentTopic(99, 99, { message: "mock-message" }, "th")
      ).rejects.toThrow(NotFoundError);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ userId: 99 });
      expect(mockTopicRepository.findOneBy).toHaveBeenCalledWith({
        topicId: 99,
      });
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

const mockUserCommentResponse: IUser = {
  userId: 99,
  username: "mock-username-comment",
  fullname: "mock-fullname-comment",
  email: "mock-email-comment",
  avatar: "mock-avatar-comment",
  deleted: false,
};

const mockTopicResponse = (
  comments: IComment[],
  topicOption?: { status?: TopicStatus; archive?: boolean }
) => ({
  topicId: 1,
  category: TopicCategory.INTERVIEW,
  description: "mock-description",
  createdAt: new Date("2022-11-19T15:19:35.000Z"),
  status: topicOption?.status || TopicStatus.TODO,
  archive: topicOption?.archive || false,
  createdBy: mockUserResponse,
  comments,
});

const mockCommentResponse = (createdBy: IUser) => ({
  commentId: 1,
  topicId: 1,
  message: "mock-message",
  createdAt: new Date("2022-11-20T15:19:35.000Z"),
  createdBy,
  deleted: false,
});

const mockTopicResponseTranslation = (comments: IComment[]) => ({
  topicId: 1,
  category: "นัดสัมภาษณ์งาน",
  description: "mock-description",
  archive: false,
  status: "กำลังรอ",
  createdAt: new Date("2022-11-19T15:19:35.000Z"),
  createdBy: {
    avatar: "mock-avatar",
    deleted: false,
    email: "mock-email",
    fullname: "mock-fullname",
    userId: 1,
    username: "mock-username",
  },
  comments,
});
