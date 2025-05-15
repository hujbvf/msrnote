import * as sqlite3 from "@sqlite.org/sqlite-wasm";
import type { NoteProps } from "../../types/note.d.ts";

// ノートを開く
export async function openNote(noteData: NoteProps) {
  const sqlite3Worker1Promiser = (sqlite3 as any).sqlite3Worker1Promiser;

  let result: any | undefined;

  try {
    // SQLite ワーカーの初期化
    const promiser: (
      command: string,
      options?: Record<string, any>,
    ) => Promise<any> = await new Promise((resolve) => {
      // SQLite ワーカーを初期化し、onready コールバックを設定
      const _promiser = sqlite3Worker1Promiser({
        onready: () => {
          // ワーカーが準備完了したら Promise を解決
          resolve(_promiser);
        },
      });
    });
    // ノートの情報を取得
    result = getNoteInfo(noteData, promiser);

    // ノートの内容を取得
    //getNoteContent(sqlite3, noteData);
  } catch (error) {
    console.error("ノートを開けませんでした:", error);
  }

  return result;
}

// ノートの情報を取得
async function getNoteInfo(noteData: NoteProps, promiser: any) {
  let filePath = "";

  // ノートツリーのデータファイルのパスを定義
  if (noteData.path.startsWith("local")) {
    filePath = "/local/tree.sqlite3";
  } else if (noteData.path.startsWith("cloud")) {
    filePath = "/cloud/tree.sqlite3";
  }

  let response: { dbId?: string };

  response = await promiser("config-get", {});

  response = await promiser("open", {
    filename: `file:${filePath}?vfs=opfs`,
  });

  const { dbId } = response;

  const noteInfoPromiser = await promiser("exec", {
    dbId,
    sql: "SELECT * FROM notes WHERE id = ?",
    bind: [noteData.id],
    rowMode: "object",
    returnValue: "resultRows",
  });

  const noteInfoData = await noteInfoPromiser.result.resultRows.at(0);

  console.log("ノートの情報:", noteInfoData);

  return noteInfoData;
}

// ノートの内容を取得
//function getNoteContent(sqlite3: any, noteData: NoteData) {
//  const filePath = `/${noteData.path}/${noteData.id}/note.sqlite3`;
//
//  const db =
//    "opfs" in sqlite3
//      ? new sqlite3.oo1.OpfsDb(filePath)
//      : new sqlite3.oo1.DB(filePath, "ct");
//
//  try {
//    const noteContent = db.exec({
//      sql: "SELECT * FROM layers WHERE page = ?",
//      bind: [noteData.page],
//      rowMode: "object",
//      returnValue: "resultRows",
//    });
//
//    return noteContent;
//  } finally {
//    db.close();
//  }
//}
