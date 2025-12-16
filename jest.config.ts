import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  preset: "ts-jest", // Use ts-jest preset
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // Path to the setup file (create this next)
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
