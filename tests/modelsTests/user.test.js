const User = require("../../models/user");
const db = require("../../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");

// Mock the db.query method
jest.mock("../../db");

describe("User Model", () => {
  describe("authenticate", () => {
    test("should authenticate user with valid credentials", async () => {
      const mockUser = {
        username: "user1",
        password: await bcrypt.hash("password", 10),
        email: "user1@example.com",
        isAdmin: false,
      };
      db.query.mockResolvedValue({ rows: [{ ...mockUser }] });

      const result = await User.authenticate("user1", "password");

      expect(result).toEqual({ username: "user1", email: "user1@example.com", isAdmin: false });
    });

    test("should throw UnauthorizedError for invalid credentials", async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(User.authenticate("user1", "invalidpassword")).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("register", () => {
    test("should register a new user", async () => {
      const mockUser = {
        username: "user1",
        password: "password",
        email: "user1@example.com",
        isAdmin: false,
      };
  
        // Mock db.query to simulate no duplicate username
        db.query.mockResolvedValueOnce({ rows: [] });
    
        // Mock bcrypt.hash correctly
        bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");
    
        db.query.mockResolvedValueOnce({ rows: [{ ...mockUser }] });
    
        const result = await User.register(mockUser);
    
        // Remove the password field from both result and expected result
        delete result.password;
        const expectedResult = { username: "user1", email: "user1@example.com", isAdmin: false };
    
        expect(result).toEqual(expectedResult);
    });
    
    test("should throw BadRequestError for duplicate username", async () => {
      db.query.mockResolvedValue({ rows: [{ username: "user1" }] });

      await expect(User.register({
        username: "user1",
        password: "password",
        email: "user1@example.com",
        isAdmin: false,
      })).rejects.toThrow(BadRequestError);
    });
  });

  describe("getAll", () => {
    test("should return all users", async () => {
      const mockUsers = [
        { username: "user1", email: "user1@example.com", isAdmin: false },
        { username: "user2", email: "user2@example.com", isAdmin: true },
      ];
      db.query.mockResolvedValue({ rows: mockUsers });

      const result = await User.getAll();

      expect(result).toEqual(mockUsers);
    });
  });

  describe("get", () => {
    test("should return user by username", async () => {
      const mockUser = { username: "user1", email: "user1@example.com", isAdmin: false };
      db.query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.get("user1");

      expect(result).toEqual(mockUser);
    });

    test("should throw NotFoundError if user not found", async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(User.get("nonexistentuser")).rejects.toThrow(NotFoundError);
    });
  });

  describe("getBalance", () => {
    test("should return user balance by username", async () => {
      const mockBalance = { username: "user1", balance: 100 };
      db.query.mockResolvedValue({ rows: [mockBalance] });

      const result = await User.getBalance("user1");

      expect(result).toEqual(mockBalance);
    });

    test("should throw NotFoundError if user not found", async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(User.getBalance("nonexistentuser")).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateBalance", () => {
    test("should update user balance by username", async () => {
      const mockUpdatedUser = { username: "user1", balance: 110 };
      db.query.mockResolvedValue({ rows: [mockUpdatedUser] });

      const result = await User.updateBalance("user1", { amount: 10 });

      expect(result).toEqual(mockUpdatedUser);
    });

    test("should throw NotFoundError if user not found", async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(User.updateBalance("nonexistentuser", { amount: 10 })).rejects.toThrow(NotFoundError);
    });
  });

  describe("delete", () => {
    test("should delete user by username", async () => {
      db.query.mockResolvedValue({ rows: [{ username: "user1" }] });

      await expect(User.delete("user1")).resolves.toBeUndefined();
    });

    test("should throw NotFoundError if user not found", async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(User.delete("nonexistentuser")).rejects.toThrow(NotFoundError);
    });
  });
});
