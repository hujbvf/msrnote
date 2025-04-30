import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

// ノートグループインターフェース
interface noteGroupData {
  id: string; // note_group_<UUID>
  name: string; // ノートグループ名
  path: string; // local/note_group_<UUID> | cloud/note_group_<UUID>
}

// メッセージ送信

let log: any[] = [];

function sendMessage() {
  self.postMessage(log);
}

// メッセージ受信
self.onmessage = async (event: MessageEvent) => {
  await addNoteGroup(event.data);

  await addNoteToTree(event.data);

  sendMessage();
};

// OPFSにフォルダを作成
async function addNoteGroup(noteGroupData: noteGroupData) {
  const root = await navigator.storage.getDirectory();

  const groupName = `${noteGroupData.path}/${noteGroupData.id}`;
  await getNestedDirectoryHandle(root, groupName, {
    create: true,
  });

  log.push("ノートグループを作成しました。", groupName);
}

// サブディレクトリを取得 & 作成
async function getNestedDirectoryHandle(
  root: FileSystemDirectoryHandle,
  path: string,
  options: { create?: boolean } = {},
): Promise<FileSystemDirectoryHandle> {
  const segments = path.split("/").filter(Boolean); // 空文字を除く
  let currentHandle = root;

  for (const segment of segments) {
    currentHandle = await currentHandle.getDirectoryHandle(segment, options);
  }

  return currentHandle;
}

// ディレクトリツリーにノートを追加
async function addNoteToTree(noteGroupData: noteGroupData) {
  const sqlite3 = await sqlite3InitModule();

  let filePath = "";

  if (noteGroupData.path.startsWith("local")) {
    filePath = "/local/tree.sqlite3";
  } else if (noteGroupData.path.startsWith("cloud")) {
    filePath = "/cloud/tree.sqlite3";
  }

  const db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb(filePath)
      : new sqlite3.oo1.DB(filePath, "ct");

  try {
    if (noteGroupData.path != "local" && noteGroupData.path != "cloud") {
      // ノートグループのパスを取得
      const path = noteGroupData.path.split("/");

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
      "CREATE TABLE IF NOT EXISTS groups (id TEXT PRIMARY KEY, name TEXT, path TEXT, num INT)",
    );
    db.exec({
      sql: "INSERT INTO groups (id, name, path, num) VALUES (?, ?, ?, ?)",
      bind: [noteGroupData.id, noteGroupData.name, noteGroupData.path, 0],
    });
    log.push("ノートグループを追加しました。", noteGroupData.path);
    const noteGroupValues = db.exec({
      sql: "SELECT * FROM groups",
      rowMode: "object",
      returnValue: "resultRows",
    });
    log.push("ノートグループの一覧", noteGroupValues);
  } finally {
    db.close();
  }
}
