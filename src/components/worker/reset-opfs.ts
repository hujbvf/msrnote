// メッセージ受信
self.onmessage = async () => {
  await resetOpfs();
};

// ルート内のすべてのファイルとディレクトリを削除
async function resetOpfs() {
  const root = (await navigator.storage.getDirectory()) as any;

  for await (const [name, entry] of root.entries()) {
    if (entry.kind === "directory") {
      await root.removeEntry(name, { recursive: true });
    } else if (entry.kind === "file") {
      await root.removeEntry(name);
    }
  }
}
