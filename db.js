const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new SQLite database file (this will create a new file if it doesn't exist)
const dbPath = path.resolve(__dirname, 'uploads.db');
const db = new sqlite3.Database(dbPath);

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS video_metadata (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectName TEXT NOT NULL,
      floorName TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      driveFileId TEXT NOT NULL,
      fileUrl TEXT NOT NULL
    )
  `);
});

module.exports = db;
