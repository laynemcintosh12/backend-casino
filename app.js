const express = require("express");
const cors = require('cors');

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const gamesRoutes = require("./routes/games");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors({
  origin: 'https://frontend-casino.onrender.com'
}))
app.use(express.json());
app.use(authenticateJWT);


/** Routes */

app.use("/auth", authRoutes);
app.use("/games", gamesRoutes);
app.use("/user", userRoutes);

/** Handle 404 errors */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});


/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});


module.exports = app;