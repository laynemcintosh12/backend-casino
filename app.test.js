const request = require("supertest");
const app = require("./app");
const db = require("./db");

afterAll(function () {
  db.end();
});

describe("Test routes and error handling", () => {
  test("GET /auth route", async () => {
    const resp = await request(app).get("/auth");
    expect(resp.statusCode).toEqual(404);
  });

  test("GET /games route", async () => {
    const resp = await request(app).get("/games");
    expect(resp.statusCode).toEqual(200);
  });

  test("GET /user route", async () => {
    const resp = await request(app).get("/user");
    expect(resp.statusCode).toEqual(200);
  });

  test("POST /nonexistent-route route", async () => {
    const resp = await request(app).post("/nonexistent-route");
    expect(resp.statusCode).toEqual(404);
  });

  test("Handle 404 error", async () => {
    const resp = await request(app).get("/nonexistent-route");
    expect(resp.statusCode).toEqual(404);
  });

  test("Generic error handler", async () => {
    const resp = await request(app).get("/error");
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.error.status).toEqual(404);
  });
});
