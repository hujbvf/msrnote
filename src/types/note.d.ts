// ノートデータ
export interface NoteProps {
  path: string;
  id: string;
  name?: string;
  page?: string;
  date?: string;
  size?: number;
}

// ノートグループデータ
export interface NoteGroupProps {
  path: string;
  id: string;
  name?: string;
  num?: number;
  date?: string;
}
