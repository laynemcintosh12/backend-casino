const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const gamesRoutes = require("../../routes/games");
const Game = require("../../models/games");

// Mock the Game model methods
jest.mock("../../models/games");

const app = express();
app.use(bodyParser.json());
app.use("/games", gamesRoutes);

describe("Game Routes", () => {
  describe("GET /games", () => {
    test("should respond with all games", async () => {
      const mockGames = [
        { game_id: 1, game_type: "type1", game_name: "name1", description: "desc1" },
        { game_id: 2, game_type: "type2", game_name: "name2", description: "desc2" }
      ];
      Game.getAll.mockResolvedValue(mockGames);

      const response = await request(app).get("/games");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ games: mockGames });
    });

    test("should handle errors", async () => {
      Game.getAll.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/games");

      expect(response.statusCode).toBe(500);
    });
  });

  describe("GET /games/:id", () => {
    test("should respond with game info", async () => {
      const mockGame = { game_id: 1, game_type: "type1", game_name: "name1", description: "desc1" };
      Game.findOne.mockResolvedValue(mockGame);

      const response = await request(app).get("/games/1");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ game: mockGame });
    });

    test("should handle errors", async () => {
      Game.findOne.mockRejectedValue(new Error("Game not found"));

      const response = await request(app).get("/games/1");

      expect(response.statusCode).toBe(500);
    });
  });
});
