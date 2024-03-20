const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const ExpressError = require("../expressError");
const Game = require("../models/games");
const gameSchema = require("../schemas/gameSchema.json");


/** GET route to get a list of all games
 * 
 * returns { game_id, game_type, game_name, description }
 * 
 */

router.get("/", async function (req, res, next) {
  try {
    const games = await Game.getAll(req.query);
    return res.json({ games });
  } catch (err) {
    return next(err);
  }
});



/** GET route to get a single game based off of an id
 * 
 * returns { game_id, game_type, game_name, description }
 * 
 */

router.get("/:id", async function (req, res, next) {
  try {
    const game = await Game.findOne(req.params.id);
    return res.json({ game });
  } catch (err) {
    return next(err);
  }
});






module.exports = router;