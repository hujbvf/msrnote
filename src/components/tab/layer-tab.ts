import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/search-input.ts";
import "../part/layer-add-button.ts";
import "../part/layer-button.ts";
import "../part/layer-group-button.ts";

@customElement("layer-tab")
export class LayerTab extends LitElement {
  static styles = [globalStyles, tabStyles];

  render() {
    return html`
      <!--タイトル-->
      <div class="title_area">
        <!--タブタイトル-->
        <span class="name">レイヤー</span>
        <!--一覧編集ボタン-->
        <span class="edit">
          <select id="layer_edit">
            <option value="edit">編集</option>
            <option value="delete">削除</option>
            <option value="select_remove">選択解除</option>
          </select>
          <label class="icon" for="layer_edit">arrow_drop_down_circle</label>
        </span>
      </div>

      <!--検索-->
      <div class="search_area">
        <search-input placeholder="レイヤーを検索"></search-input>
      </div>

      <!--内容-->
      <div class="content_area">
        <layer-add-button></layer-add-button>
        <layer-group-button
          name="レイヤーグループ"
          num="2"
        ></layer-group-button>
        <layer-button
          name="レイヤー1"
          date="2025/01/22 21:22:04"
        ></layer-button>
        <layer-button
          name="レイヤー2"
          date="2025/01/22 21:22:04"
        ></layer-button>
      </div>
    `;
  }
}
