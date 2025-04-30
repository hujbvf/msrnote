import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

// メッセージ受信関数
self.onmessage = async (event: MessageEvent) => {
  await init(event.data);
};

// 初期化処理
async function init(groupPath: string) {
  const sqlite3 = await sqlite3InitModule();
  fetch(sqlite3, groupPath);
}

async function fetch(sqlite3: any, groupPath: string) {
  let filePath = "";

  if (groupPath.startsWith("local")) {
    filePath = "/local/tree.sqlite3";
  } else if (groupPath.startsWith("cloud")) {
    filePath = "/cloud/tree.sqlite3";
  }

  const db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb(filePath)
      : new sqlite3.oo1.DB(filePath, "ct");

  try {
    // pathがgroupPathと一致するノートグループを取得
    db.exec(
      "CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, name TEXT, path TEXT, num INT)",
    );

    const groupPathArray = groupPath.split("/");
    // 1番目の要素を削除
    groupPathArray.shift();

    const noteGroupValues = db.exec({
      sql: `SELECT * FROM groups WHERE id IN (${groupPathArray.map(() => "?").join(",")})`,
      bind: groupPathArray,
      rowMode: "object",
      returnValue: "resultRows",
    });

    self.postMessage(noteGroupValues);
  } finally {
    db.close();
  }
}
