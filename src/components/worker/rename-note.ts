import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

// メッセージ受信
self.onmessage = async (event: MessageEvent) => {
  await renameNote(event.data.notePath, event.data.noteID, event.data.newName);
};

// 初期化処理
async function renameNote(notePath: string, noteID: string, newName: string) {
  let filePath = "";

  if (notePath.startsWith("local")) {
    filePath = "/local/tree.sqlite3";
  } else if (notePath.startsWith("cloud")) {
    filePath = "/cloud/tree.sqlite3";
  }

  const sqlite3 = await sqlite3InitModule();

  const db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb(filePath)
      : new sqlite3.oo1.DB(filePath, "ct");

  try {
    if (noteID.startsWith("note_group_")) {
      // id が noteID と一致するノートグループを更新
      db.exec({
        sql: "UPDATE groups SET name = ? WHERE id = ?",
        bind: [newName, noteID],
      });
    } else {
      // id が noteID と一致するノートを削除
      db.exec({
        sql: "UPDATE notes SET name = ? WHERE id = ?",
        bind: [newName, noteID],
      });
    }
  } finally {
    db.close();
  }
}
