const config = require("./config");

describe("Config", () => {
  beforeEach(() => {
    // Clear any environment variables that might affect the tests
    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.DATABASE_URL;
    delete process.env.NODE_ENV;
  });

  test("Defaults", () => {
    expect(config.SECRET_KEY).toEqual("secret-dev");
    expect(config.PORT).toEqual(3001);
    expect(config.getDatabaseUri()).toEqual("casino");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(1);
  });

  test("Environment Variables", () => {
    process.env.SECRET_KEY = "secret-dev";
    process.env.PORT = "3001";
    process.env.NODE_ENV = "test";
    process.env.DATABASE_URL = "test-db";

    expect(config.SECRET_KEY).toEqual("secret-dev");
    expect(config.PORT).toEqual(3001);
    expect(config.getDatabaseUri()).toEqual("casino-test");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(1);
  });
});
