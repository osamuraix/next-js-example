import * as Faker from "faker";
import { Service } from "typedi";
import { JsonController, Get } from "routing-controllers";
import { AppDataSource } from "../database/mysql/AppDataSource";
import { User } from "../entities/User";
import { Topic, TopicCategory, TopicStatus } from "../entities/Topic";

@Service()
@JsonController("/v1/seeds")
export class SeedController {
  @Get("/users")
  async seedUsers() {
    const usersToSeed = 10;
    const userRepository = AppDataSource.getRepository(User);

    for (let i = 0; i < usersToSeed; i++) {
      const user = new User();
      user.username = Faker.internet.userName();
      user.password = "password";
      user.fullname = Faker.name.findName();
      user.email = Faker.internet.email();
      user.status = true;

      await userRepository.save(user);
    }

    return { message: `Seeded ${usersToSeed} users` };
  }

  @Get("/topics")
  async seedTopics() {
    const topicsToSeed = 10;
    const topicRepository = AppDataSource.getRepository(Topic);
    const userRepository = AppDataSource.getRepository(User);

    for (let i = 0; i < topicsToSeed; i++) {
      const randomUser = await userRepository.query(
        "SELECT * FROM user ORDER BY RAND() LIMIT 1"
      );

      if (randomUser[0]) {
        const topic = new Topic();
        topic.category = Faker.random.arrayElement(
          Object.values(TopicCategory)
        );
        topic.description = Faker.lorem.sentence();
        topic.createdBy = randomUser[0];
        topic.createdAt = Faker.date.past();
        topic.status = Faker.random.arrayElement(Object.values(TopicStatus));

        await topicRepository.save(topic);
      }
    }

    return { message: `Seeded ${topicsToSeed} topics` };
  }
}
