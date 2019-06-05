module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  roots: ["<rootDir>/tests/"],
  testMatch: ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleFileExtensions: [
    "ts",
    "js",
    "json",
  ],
}
