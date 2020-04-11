import { configService } from "../config/config.service";

const startSync = async () => {
  console.log(configService);
};

console.log("--> Start sync");
startSync();
