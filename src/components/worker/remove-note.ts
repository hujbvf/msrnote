import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

// メッセージ受信
self.onmessage = async (event: MessageEvent) => {
  await init(event.data.notePath, event.data.noteID);
};

// 初期化処理
async function init(notePath: string, noteID: string) {
  await removeFromOPFS(notePath, noteID);

  await removeFromDirTree(notePath, noteID);
}

// OPFSからノートを削除
async function removeFromOPFS(notePath: string, noteID: string) {
  const root = await navigator.storage.getDirectory();

  let noteDir = "";

  if (noteID.startsWith("note_group_")) {
    // グループ
    noteDir = `${notePath}/${noteID}`;
    await removeEntryByPath(root, noteDir, { recursive: true });
  } else {
    // ノート
    noteDir = `${notePath}/${noteID}/note.sqlite3`;
    await removeEntryByPath(root, noteDir, { recursive: true });
  }
  self.postMessage(`OPFSから${noteDir}を削除しました。`);
}

async function removeEntryByPath(
  root: FileSystemDirectoryHandle,
  pathString: string,
  options: { recursive?: boolean } = {},
): Promise<void> {
  const parts = pathString.split("/").filter(Boolean);

  if (parts.length === 0) {
    self.postMessage("空のパスは許可されていません。");
  }

  const entryName = parts.pop()!; // 最後のファイル or ディレクトリ名
  let currentDir = root;

  // 中間のディレクトリをたどる
  for (const part of parts) {
    currentDir = await currentDir.getDirectoryHandle(part);
  }

  // 削除を試みる（まずファイル、だめならフォルダとして）
  try {
    await currentDir.removeEntry(entryName, options);
  } catch (err: any) {
    self.postMessage(`"${pathString}"の削除に失敗しました:`, err);
  }
}

// ディレクトリツリーからノートを削除
async function removeFromDirTree(notePath: string, noteID: string) {
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
    if (notePath != "local" && notePath != "cloud") {
      // ノートグループのパスを取得
      const path = notePath.split("/");

      // ノートグループのIDを取得
      const groupID = path.at(-1);

      const groupValues = db.exec({
        sql: "SELECT * FROM groups WHERE id = ?",
        bind: [groupID],
        rowMode: "object",
        returnValue: "resultRows",
      });

      if (groupValues.length > 0 && typeof groupValues[0].num === "number") {
        const num = groupValues[0].num - 1;

        db.exec({
          sql: "UPDATE groups SET num = ? WHERE id = ?",
          bind: [num, groupID],
        });
      }
    }

    if (noteID.startsWith("note_group_")) {
      // id が noteID と一致するノートグループを削除
      db.exec({
        sql: "DELETE FROM groups WHERE id = ?",
        bind: [noteID],
      });
    } else {
      // id が noteID と一致するノートを削除
      db.exec({
        sql: "DELETE FROM notes WHERE id = ?",
        bind: [noteID],
      });
    }

    self.postMessage(`${noteID}を削除しました。`);
  } finally {
    db.close();
  }
}
