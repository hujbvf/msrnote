import { createContext } from "@lit/context";

import type { NoteData } from "../storage/types.ts";

export interface TabData {
  noteDatas: NoteData[] | [];
  activeTab: number;
  addNoteData: (noteData: NoteData) => void;
  removeNoteData: (sort: number) => void;
  changeActiveTab: (sort: number) => void;
}

export const tabContext = createContext<TabData>("tab-context");
