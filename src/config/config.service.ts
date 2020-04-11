import * as dotenv from "dotenv";
import * as fs from "fs";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor(filePath?: string) {
    if (!filePath) {
      filePath = `.env.${process.env.ENV_FILE || process.env.NODE_ENV || "development"}`;
    }

    try {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    } catch (e) {
      console.error(`Cannot find ${filePath} fallback to process.env`);
      this.envConfig = process.env;
    }
  }

  getValue(key: string, throwOnMissing = true): string {
    const value = this.envConfig[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  getPort() {
    return this.getValue("PORT");
  }

  isProduction() {
    return this.getValue("NODE_ENV", false).toLocaleLowerCase() === "production";
  }

  isTest(): boolean {
    return this.getValue("NODE_ENV", false).toLocaleLowerCase() === "test";
  }

  isDevelopment(): boolean {
    return !this.isProduction() && !this.isTest();
  }

  sessionKey(): string {
    return this.getValue("SESSION_KEY");
  }

  sessionName(): string {
    return this.getValue("SESSION_NAME");
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.getValue("DATABASE_URL"),
      port: parseInt(this.getValue("DATABASE_PORT"), 10),
      username: this.getValue("DATABASE_USERNAME", false),
      password: this.getValue("DATABASE_PASSWORD", false),
      database: this.getValue("DATABASE_NAME"),

      extra: {
        domain: this.getValue("DATABASE_DOMAIN", false),
        requestTimeout: 30000,
        encrypt: true, // Enable SSL
      },

      entities: [__dirname + "/../**/*.entity{.ts,.js}"],

      migrationsTableName: "migrations",

      synchronize: false,
      migrationsRun: false,
      logging: this.isDevelopment(),

      keepConnectionAlive: this.isTest(),

      migrations: [__dirname + "/../migrations/**/*{.ts,.js}"],

      cli: {
        migrationsDir: "src/migrations",
      },

      ssl: this.isProduction(),
    };
  }
}

const configService = new ConfigService().ensureValues([
  "DATABASE_URL",
  "DATABASE_PORT",
  "DATABASE_NAME",
  "SESSION_NAME",
  "SESSION_KEY",
]);

export { configService };
