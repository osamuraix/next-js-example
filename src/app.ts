import "reflect-metadata";
import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "koa-cors";
import logger from "koa-logger";
import fs from "fs";
import { Container } from "typedi";
import {
  useContainer,
  useKoaServer,
  getMetadataArgsStorage,
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";

import { AppDataSource } from "./database/mysql/AppDataSource";
import { UserController } from "./controllers/UserController";
import { TopicController } from "./controllers/TopicController";
import { SeedController } from "./controllers/SeedController";

useContainer(Container);

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());
app.use(logger());

AppDataSource.initialize()
  .then(async () => {
    useKoaServer(app, {
      controllers: [UserController, TopicController, SeedController],
    });

    const spec = routingControllersToSpec(getMetadataArgsStorage(), {
      controllers: [UserController, TopicController, SeedController],
    });

    router.get("/", async (ctx) => {
      ctx.type = "text/html";
      ctx.body = fs.createReadStream(`${__dirname}/index.html`);
    });

    router.get("/swagger.json", (ctx) => {
      ctx.set("Content-Type", "application/json");
      ctx.body = spec;
    });

    router.get("/health-check", async (ctx) => {
      ctx.body = "Hello, Koa API!";
    });

    app.use(router.routes());
    app.use(router.allowedMethods());

    const i18next = require("i18next");
    const i18nextMiddleware = require("i18next-express-middleware");
    const Backend = require("i18next-node-fs-backend");

    i18next
      .use(i18nextMiddleware.LanguageDetector)
      .use(Backend)
      .init({
        backend: {
          loadPath: `${__dirname}/locales/{{lng}}/{{ns}}.json`,
        },
        fallbackLng: 'th', // Default language
        preload: ['th', 'en'],
        debug: false, // Set to true for debugging
        interpolation: {
          escapeValue: false, // Disable escaping for HTML tags
        },
      });

    app.use(i18next.init);
  })
  .catch((error) => console.log(error));

export default app;
