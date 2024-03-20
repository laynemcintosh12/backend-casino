const db = require("../db");
const { NotFoundError } = require("../expressError");

class Game {

  /** Get all games from the database 
   * 
   *  returns { game_id, game_type, game_name, description }
   * 
   * Throws NotFoundError if no games found.
  */

  static async getAll() {
    const gamesRes = await db.query(
      `SELECT game_id AS "gameId",
              game_type AS "gameType",
              game_name AS "gameName",
              description
       FROM games`
    );
  
    const games = gamesRes.rows;
    if (games.length === 0) throw new NotFoundError("No games found");
  
    return games;
  }
  

  /** Get a single game from the database
   * 
   * returns { game_id, game_type, game_name, description }
   * 
   * Throws NotFoundError if game not found.
   * 
  */

  static async findOne(id) {
    const gameRes = await db.query(
      `SELECT game_id AS "gameId",
              game_type AS "gameType",
              game_name AS "gameName",
              description
       FROM games
       WHERE game_id = $1`,
      [id]
    );

    const game = gameRes.rows[0];

    if (!game) throw new NotFoundError(`No game found with id ${id}`);

    return game;
  }



  
}

module.exports = Game;
