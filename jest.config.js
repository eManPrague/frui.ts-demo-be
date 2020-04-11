module.exports = {
  verbose: true,
  rootDir: "src",
  testRegex: ".spec.ts$",
  moduleFileExtensions: ["js", "json", "ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {},
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  setupFilesAfterEnv: ["../test/jest.after_env.setup.ts"],
};
