import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

// メッセージ受信関数
self.onmessage = async (event: MessageEvent) => {
  await init(event.data);
};

// 初期化処理
async function init(notePath: string) {
  const sqlite3 = await sqlite3InitModule();
  fetch(sqlite3, notePath);
}

// ディレクトリツリーにノートを追加
function fetch(sqlite3: any, notePath: string) {
  let filePath = "";

  if (notePath.startsWith("local")) {
    filePath = "/local/tree.sqlite3";
  } else if (notePath.startsWith("cloud")) {
    filePath = "/cloud/tree.sqlite3";
  }

  const db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb(filePath)
      : new sqlite3.oo1.DB(filePath, "ct");

  try {
    // pathがnotePathと一致するノートを取得
    db.exec(
      "CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, name TEXT, path TEXT, date TEXT)",
    );
    const noteValues = db.exec({
      sql: "SELECT * FROM notes WHERE path = ?",
      bind: [notePath],
      rowMode: "object",
      returnValue: "resultRows",
    });

    self.postMessage(noteValues);

    // pathがnotePathと一致するノートグループを取得
    db.exec(
      "CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, name TEXT, path TEXT, num INT)",
    );
    const noteGroupValues = db.exec({
      sql: "SELECT * FROM groups WHERE path = ?",
      bind: [notePath],
      rowMode: "object",
      returnValue: "resultRows",
    });

    self.postMessage(noteGroupValues);
  } finally {
    db.close();
  }
}
