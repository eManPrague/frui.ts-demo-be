// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("../jest.config");

module.exports = {
  ...config,
  rootDir: "../src",
  roots: ["../test"],
  testRegex: ".e2e-spec.ts$",
};
