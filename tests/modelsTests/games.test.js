const Game = require("../../models/games");
const db = require("../../db");
const { NotFoundError } = require("../../expressError");

// Mock the db.query method
jest.mock("../../db");

describe("Game Model", () => {
  describe("getAll", () => {
    test("should return all games", async () => {
      const mockGames = [
        { gameId: 1, gameType: "type1", gameName: "name1", description: "desc1" },
        { gameId: 2, gameType: "type2", gameName: "name2", description: "desc2" }
      ];
      db.query.mockResolvedValue({ rows: mockGames });

      const result = await Game.getAll();

      expect(result).toEqual(mockGames);
    });

    test("should throw NotFoundError if no games found", async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Game.getAll()).rejects.toThrow(NotFoundError);
    });
  });

  describe("findOne", () => {
    test("should return game by id", async () => {
      const mockGame = { gameId: 1, gameType: "type1", gameName: "name1", description: "desc1" };
      db.query.mockResolvedValue({ rows: [mockGame] });

      const result = await Game.findOne(1);

      expect(result).toEqual(mockGame);
    });

    test("should throw NotFoundError if game not found", async () => {
      db.query.mockResolvedValue({ rows: [] });

      await expect(Game.findOne(1)).rejects.toThrow(NotFoundError);
    });
  });
});
