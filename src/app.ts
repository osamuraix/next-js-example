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

useContainer(Container);

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors());
app.use(logger());

AppDataSource.initialize()
  .then(async () => {
    useKoaServer(app, {
      controllers: [UserController],
    });

    const spec = routingControllersToSpec(getMetadataArgsStorage(), {
      controllers: [UserController],
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
  })
  .catch((error) => console.log(error));

export default app;
