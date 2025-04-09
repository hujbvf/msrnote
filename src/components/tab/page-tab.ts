import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/search-input.ts";
import "../part/page-add-button.ts";
import "../part/page-button.ts";

@customElement("page-tab")
export class PageTab extends LitElement {
  static styles = [globalStyles, tabStyles];

  render() {
    return html`
      <!--タイトル-->
      <div class="title_area">
        <!--タブタイトル-->
        <span class="name">ページ</span>
        <!--一覧編集ボタン-->
        <span class="edit">
          <select id="page_edit">
            <option value="edit">編集</option>
            <option value="delete">削除</option>
            <option value="select_remove">選択解除</option>
          </select>
          <label class="icon" for="page_edit">arrow_drop_down_circle</label>
        </span>
      </div>

      <!--検索-->
      <div class="search_area">
        <search-input placeholder="ページを検索"></search-input>
      </div>

      <!--内容-->
      <div class="content_area">
        <page-add-button></page-add-button>
        <page-button name="ページ1" date="2025/01/22 21:22:04"></page-button>
        <page-button name="ページ2" date="2025/01/22 21:22:04"></page-button>
      </div>
    `;
  }
}
