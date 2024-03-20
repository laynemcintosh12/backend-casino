const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("../../routes/auth");
const User = require("../../models/user");

// Mock the User model methods
jest.mock("../../models/user");

const app = express();
app.use(bodyParser.json());
app.use("/auth", authRoutes);

describe("Auth Routes", () => {
  describe("POST /auth/login", () => {
    test("should respond with token for valid credentials", async () => {
      const mockUser = { id: 1, username: "user1", password: "password" };
      User.authenticate.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "user1", password: "password" });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    test("should handle validation errors", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({});

      expect(response.statusCode).toBe(400);
    });

    test("should handle authentication errors", async () => {
      User.authenticate.mockRejectedValue(new Error("Authentication failed"));

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "user1", password: "password" });

      expect(response.statusCode).toBe(500);
    });
  });

  describe("POST /auth/register", () => {
    test("should respond with token for valid registration", async () => {
      const mockUser = { id: 1, username: "user1", password: "password", email: "user1@example.com" };
      User.register.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/auth/register")
        .send({ username: "user1", password: "password", email: "user1@example.com" });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("token");
    });

    test("should handle validation errors", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({});

      expect(response.statusCode).toBe(400);
    });

    test("should handle registration errors", async () => {
      User.register.mockRejectedValue(new Error("Registration failed"));

      const response = await request(app)
        .post("/auth/register")
        .send({ username: "user1", password: "password", email: "user1@example.com" });

      expect(response.statusCode).toBe(500);
    });
  });
});
