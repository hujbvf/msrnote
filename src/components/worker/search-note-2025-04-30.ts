import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

// メッセージ受信関数
self.onmessage = async (event: MessageEvent) => {
  await fetchSearchNote(event.data);
};

async function fetchSearchNote(noteName: string) {
  const sqlite3 = await sqlite3InitModule();

  let filePath = "/local/tree.sqlite3";

  let db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb(filePath)
      : new sqlite3.oo1.DB(filePath, "ct");

  try {
    // ノートの名前を検索
    db.exec(
      "CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, name TEXT, path TEXT, date TEXT)",
    );
    const noteValues = db.exec({
      sql: "SELECT * FROM notes WHERE name LIKE ?",
      bind: [`%${noteName}%`],
      rowMode: "object",
      returnValue: "resultRows",
    });

    self.postMessage(noteValues);

    // ノートグループの名前を検索
    db.exec(
      "CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, name TEXT, path TEXT, num INT)",
    );
    const noteGroupValues = db.exec({
      sql: "SELECT * FROM groups WHERE name LIKE ?",
      bind: [`%${noteName}%`],
      rowMode: "object",
      returnValue: "resultRows",
    });

    self.postMessage(noteGroupValues);
  } finally {
    db.close();
  }

  filePath = "/cloud/tree.sqlite3";

  db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb(filePath)
      : new sqlite3.oo1.DB(filePath, "ct");

  try {
    // ノートの名前を検索
    db.exec(
      "CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, name TEXT, path TEXT, date TEXT)",
    );
    const noteValues = db.exec({
      sql: "SELECT * FROM notes WHERE name LIKE ?",
      bind: [`%${noteName}%`],
      rowMode: "object",
      returnValue: "resultRows",
    });

    self.postMessage(noteValues);

    // ノートグループの名前を検索
    db.exec(
      "CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, name TEXT, path TEXT, num INT)",
    );
    const noteGroupValues = db.exec({
      sql: "SELECT * FROM groups WHERE name LIKE ?",
      bind: [`%${noteName}%`],
      rowMode: "object",
      returnValue: "resultRows",
    });

    self.postMessage(noteGroupValues);
  } finally {
    db.close();
  }
}
