const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client(
    getDatabaseUri()
  );
} else {
  db = new Client(
    getDatabaseUri(),
  );
  
}


db.connect();

module.exports = db;