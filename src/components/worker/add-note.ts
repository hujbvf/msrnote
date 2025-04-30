import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

// ノートインターフェース
interface noteData {
  id: string; // note_<UUID>
  name: string; // note_<UUID>
  path: string; // local/note_group_<UUID> | cloud/note_group_<UUID>
  date: string; // new Date().toLocaleString()
}

// メッセージ送信

let log: string[] = [];

function sendMessage() {
  self.postMessage(log);
}

// メッセージ受信
self.onmessage = async (event: MessageEvent) => {
  await init(event.data);

  sendMessage();
};

// 初期化処理
async function init(noteData: noteData) {
  try {
    log.push("SQLite3の読み込みと初期化を開始します。");

    const sqlite3 = await sqlite3InitModule();

    log.push("SQLite3の読み込みと初期化が完了しました。");

    await start(sqlite3, noteData);

    await getEntries(noteData);

    await addNoteToTree(sqlite3, noteData);
  } catch (err: any) {
    log.push(
      "SQLite3の読み込みと初期化に失敗しました。",
      err.name,
      err.message,
    );
  }
}

// ノートを作成
async function start(sqlite3: any, noteData: noteData) {
  log.push(
    "SQLite3のバージョン: ",
    sqlite3.capi.sqlite3_libversion(),
    sqlite3.capi.sqlite3_sourceid(),
  );

  const filePath = `/${noteData.path}/${noteData.id}/note.sqlite3`;

  const db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb(filePath)
      : new sqlite3.oo1.DB(filePath, "ct");

  log.push(
    "opfs" in sqlite3
      ? `OPFSは使用可能です。ファイル名「${db.filename}」`
      : `OPFSは使用不可です。ファイル名「${db.filename}」`,
  );
}

// OPFS に保存されているファイル・ディレクトリを取得
async function getEntries(noteData: noteData) {
  const root = await navigator.storage.getDirectory();

  let dir: FileSystemDirectoryHandle | null = null;

  if (noteData.path.startsWith("local")) {
    dir = await root.getDirectoryHandle("local", { create: true });
  } else if (noteData.path.startsWith("cloud")) {
    dir = await root.getDirectoryHandle("cloud", { create: true });
  }

  const entries = (dir as any).entries();

  for await (const [name, entry] of entries) {
    log.push("パス", name, entry.kind);
  }
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
