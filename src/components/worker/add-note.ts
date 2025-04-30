import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

// ノートインターフェース
interface noteData {
  id: string; // note_<UUID>
  name: string; // note_<UUID>
  path: string; // local/note_group_<UUID> | cloud/note_group_<UUID>
  date: string; // new Date().toLocaleString()
}

// メッセージ受信
self.onmessage = async (event: MessageEvent) => {
  await init(event.data);

  self.postMessage(null);
};

// 初期化処理
async function init(noteData: noteData) {
  const sqlite3 = await sqlite3InitModule();

  await addNote(sqlite3, noteData);

  await addNoteToTree(sqlite3, noteData);
}

// ノートを作成
async function addNote(sqlite3: any, noteData: noteData) {
  const filePath = `/${noteData.path}/${noteData.id}/note.sqlite3`;

  "opfs" in sqlite3
    ? new sqlite3.oo1.OpfsDb(filePath)
    : new sqlite3.oo1.DB(filePath, "ct");
}

// ディレクトリツリーにノートを追加
async function addNoteToTree(sqlite3: any, noteData: noteData) {
  let filePath = "";

  if (noteData.path.startsWith("local")) {
    filePath = "/local/tree.sqlite3";
  } else if (noteData.path.startsWith("cloud")) {
    filePath = "/cloud/tree.sqlite3";
  }
  const db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb(filePath)
      : new sqlite3.oo1.DB(filePath, "ct");

  try {
    if (noteData.path != "local" && noteData.path != "cloud") {
      // ノートグループのパスを取得
      const path = noteData.path.split("/");

      // ノートグループのIDを取得
      const groupID = path.at(-1);

      const groupValues = db.exec({
        sql: "SELECT * FROM groups WHERE id = ?",
        bind: [groupID],
        rowMode: "object",
        returnValue: "resultRows",
      });

      if (groupValues.length > 0 && typeof groupValues[0].num === "number") {
        const num = groupValues[0].num + 1;

        db.exec({
          sql: "UPDATE groups SET num = ? WHERE id = ?",
          bind: [num, groupID],
        });
      }
    }

    db.exec(
      "CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, name TEXT, path TEXT, date TEXT)",
    );
    db.exec({
      sql: "INSERT INTO notes (id, name, path, date) VALUES (?, ?, ?, ?)",
      bind: [noteData.id, noteData.name, noteData.path, noteData.date],
    });
  } finally {
    db.close();
  }
}
