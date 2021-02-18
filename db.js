const sqlite3 = require('sqlite3').verbose()

function dbConnection(dbname) {
  let db = new sqlite3.Database(`./databases/kys${dbname}.db`)
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users(
      id integer PRIMARY KEY AUTOINCREMENT, 
      user_id integer,
      username text,
      user_avatarURL text, 
      user_messages integer DEFAULT 0, 
      user_xp integer DEFAULT 0,
      user_level integer DEFAULT 1,
      user_status text,
      user_joinedTimestamp integer,
      user_rating integer DEFAULT 0
      )`)
  })
  return db
}

module.exports = dbConnection
