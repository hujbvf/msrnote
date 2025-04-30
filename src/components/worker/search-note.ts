import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

// メッセージ受信関数
self.onmessage = async (event: MessageEvent) => {
  await fetchSearchNote(event.data);
};

async function fetchSearchNote(noteName: string) {
  const sqlite3 = await sqlite3InitModule();
  const dbPaths = ["/local/tree.sqlite3", "/cloud/tree.sqlite3"];
  type SqlRow = { [columnName: string]: any };

  type SearchResults = {
    local: { notes: SqlRow[]; groups: SqlRow[] };
    cloud: { notes: SqlRow[]; groups: SqlRow[] };
  };

  const results: SearchResults = {
    local: { notes: [], groups: [] },
    cloud: { notes: [], groups: [] },
  };

  for (const filePath of dbPaths) {
    const dbType = filePath.includes("local") ? "local" : "cloud";

    const db =
      "opfs" in sqlite3
        ? new sqlite3.oo1.OpfsDb(filePath)
        : new sqlite3.oo1.DB(filePath, "ct");

    try {
      db.exec(
        "CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, name TEXT, path TEXT, date TEXT)",
      );
      results[dbType].notes = db.exec({
        sql: "SELECT * FROM notes WHERE name LIKE ?",
        bind: [`%${noteName}%`],
        rowMode: "object",
        returnValue: "resultRows",
      });

      db.exec(
        "CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, name TEXT, path TEXT, num INT)",
      );
      results[dbType].groups = db.exec({
        sql: "SELECT * FROM groups WHERE name LIKE ?",
        bind: [`%${noteName}%`],
        rowMode: "object",
        returnValue: "resultRows",
      });
    } finally {
      db.close();
    }
  }

  self.postMessage(results);
}
