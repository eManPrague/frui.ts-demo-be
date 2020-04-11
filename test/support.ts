import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import * as request from "supertest";

dotenv.config({ path: `.env.test` });

import User, { UserRole } from "../src/portal/user/user.entity";

import { Repository } from "typeorm";

import { Test, TestingModuleBuilder } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { ValidationPipe } from "@nestjs/common";

export const createTestApp = async (override: { [key: string]: any } = {}) => {
  let moduleFixtureBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  for (const key in override) {
    if (override.hasOwnProperty(key)) {
      moduleFixtureBuilder = moduleFixtureBuilder.overrideProvider(key).useValue(override[key]);
    }
  }

  const moduleFixture = await moduleFixtureBuilder.compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  await app.init();

  return app;
};

export const createUserAgent = async (app: any, user: User, password: string): Promise<request.SuperTest<request.Test>> => {
  const agent = request.agent(app.getHttpServer());

  const resp = await agent.post("/session").send({
    email: user.email,
    password,
  });

  expect(resp.status).toBe(201);

  return agent;
};

export const cleanDb = async (entities: any[]) => {
  try {
    for (const entity of entities) {
      const repository: Repository<any> = entity.getRepository();
      await repository.query(`DELETE FROM ${repository.metadata.tableName};`);
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
};

// tslint:disable-next-line: max-line-length
export const createUser = async (data: Partial<User> = {}): Promise<User> => {
  // tslint:disable-next-line: variable-name
  // eslint-disable-next-line @typescript-eslint/camelcase
  const encryptedPassword = await bcrypt.hash(data.encryptedPassword, 10);

  const user = User.create({
    email: data.email,
    encryptedPassword,
    role: data.role || UserRole.Admin,
  });

  return user.save();
};

export const authorized = (app: any, endpoint: string, method: string, data?: any) => {
  let scope = request(app.getHttpServer());
  scope = scope[method](endpoint);

  if (method !== "get") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    scope = scope.send(data);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return scope.expect(401).expect({ statusCode: 401, message: "Not authorized." });
};
