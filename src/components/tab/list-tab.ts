import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/search-input.ts";
import "../part/note-add-button.ts";
import "../part/note-button.ts";
import "../part/note-group-button.ts";

@customElement("list-tab")
export class ListTab extends LitElement {
  static styles = [globalStyles, tabStyles];

  render() {
    return html`
      <!--タイトル-->
      <div class="title_area">
        <!--タブタイトル-->
        <span class="name">一覧</span>
        <!--一覧編集ボタン-->
        <span class="edit">
          <select id="note_edit">
            <option value="edit">編集</option>
            <option value="delete">削除</option>
            <option value="select_remove">選択解除</option>
          </select>
          <label class="icon" for="note_edit">arrow_drop_down_circle</label>
        </span>
      </div>

      <!--検索-->
      <div class="search_area">
        <search-input placeholder="ノートを検索"></search-input>
      </div>

      <!--内容-->
      <div class="content_area">
        <h2>端末内</h2>
        <note-add-button></note-add-button>
        <note-group-button name="ノートグループ" num="2"></note-group-button>
        <note-button name="ノート1" date="2025/01/22 21:22:04"></note-button>
        <h2>クラウド</h2>
        <note-add-button></note-add-button>
        <note-group-button name="公開グループ" num="0"></note-group-button>
        <note-button name="ノート2" date="2025/01/22 21:22:04"></note-button>
      </div>
    `;
  }
}
