const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("../../routes/users");
const User = require("../../models/user");

// Mock the User model methods
jest.mock("../../models/user");

const app = express();
app.use(bodyParser.json());
app.use("/users", usersRoutes);

describe("Users Routes", () => {
  describe("GET /users", () => {
    test("should respond with all users", async () => {
      const mockUsers = [{ username: "user1" }, { username: "user2" }];
      User.getAll.mockResolvedValue(mockUsers);

      const response = await request(app).get("/users");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ user: mockUsers });
    });

    test("should handle errors", async () => {
      User.getAll.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/users");

      expect(response.statusCode).toBe(500);
    });
  });

  describe("GET /users/:username", () => {
    test("should respond with user info", async () => {
      const mockUser = { username: "user1", balance: 100 };
      User.get.mockResolvedValue(mockUser);

      const response = await request(app).get("/users/user1");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ user: mockUser });
    });

    test("should handle errors", async () => {
      User.get.mockRejectedValue(new Error("User not found"));

      const response = await request(app).get("/users/user1");

      expect(response.statusCode).toBe(500);
    });
  });

  describe("GET /users/balance/:username", () => {
    test("should respond with user balance", async () => {
      const mockBalance = { balance: 100 };
      User.getBalance.mockResolvedValue(mockBalance);

      const response = await request(app).get("/users/balance/user1");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ user: mockBalance });
    });

    test("should handle errors", async () => {
      User.getBalance.mockRejectedValue(new Error("User not found"));

      const response = await request(app).get("/users/balance/user1");

      expect(response.statusCode).toBe(500);
    });
  });

  describe("PUT /users/bet/:username", () => {
    test("should update user balance", async () => {
      const mockUser = { username: "user1", balance: 90 };
      User.updateBalance.mockResolvedValue(mockUser);

      const response = await request(app)
        .put("/users/bet/user1")
        .send({ amount: 10 });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ user: mockUser });
    });

    test("should handle errors", async () => {
      User.updateBalance.mockRejectedValue(new Error("Failed to update balance"));

      const response = await request(app)
        .put("/users/bet/user1")
        .send({ amount: 10 });

      expect(response.statusCode).toBe(500);
    });
  });

  describe("DELETE /users/:username", () => {
    test("should delete user", async () => {
      const mockUser = { username: "user1" };
      User.delete.mockResolvedValue(mockUser);

      const response = await request(app).delete("/users/user1");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ user: mockUser });
    });

    test("should handle errors", async () => {
      User.delete.mockRejectedValue(new Error("Failed to delete user"));

      const response = await request(app).delete("/users/user1");

      expect(response.statusCode).toBe(500);
    });
  });
});
