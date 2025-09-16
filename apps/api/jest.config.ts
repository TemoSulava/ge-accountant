import type { Config } from "jest";

const config: Config = {
  rootDir: ".",
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  collectCoverageFrom: ["src/**/*.{ts,js}"],
  coverageDirectory: "../coverage",
  testEnvironment: "node"
};

export default config;
