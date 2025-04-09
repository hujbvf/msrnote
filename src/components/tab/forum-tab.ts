import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/search-input.ts";
import "../part/chat-add-button.ts";
import "../part/chat-button.ts";

@customElement("forum-tab")
export class ForumTab extends LitElement {
  static styles = [globalStyles, tabStyles];

  render() {
    return html`
      <!--タイトル-->
      <div class="title_area">
        <!--タブタイトル-->
        <span class="name">フォーラム</span>
        <!--一覧編集ボタン-->
        <span class="edit">
          <select id="chat_edit">
            <option value="edit">編集</option>
            <option value="delete">削除</option>
            <option value="select_remove">選択解除</option>
          </select>
          <label class="icon" for="chat_edit">arrow_drop_down_circle</label>
        </span>
      </div>

      <!--検索-->
      <div class="search_area">
        <search-input placeholder="フォーラムを検索"></search-input>
      </div>

      <!--内容-->
      <div class="content_area">
        <h2>
          <span class="name">お知らせ</span>
          <span class="icon">chevron_right</span>
        </h2>
        <chat-add-button></chat-add-button>
        <chat-button date="2025/01/22 21:22:04">
          <p>チャットコメント。</p>
        </chat-button>
        <h2>
          <span class="name">バグ</span>
          <span class="icon">chevron_right</span>
        </h2>
        <chat-add-button></chat-add-button>
        <chat-button date="2025/01/22 21:22:04">
          <p>
            チャットコメント。<br />2行目のチャットコメント。<br />3行目のチャットコメントは、とても長いコメントです。それはこのように表示されます。
          </p>
        </chat-button>
        <h2>
          <span class="name">質問</span>
          <span class="icon">chevron_right</span>
        </h2>
        <chat-add-button></chat-add-button>
        <chat-button date="2025/01/22 21:22:04">
          <p>チャットコメント。</p>
        </chat-button>
        <h2>
          <span class="name">要望</span>
          <span class="icon">chevron_right</span>
        </h2>
        <chat-add-button></chat-add-button>
        <chat-button date="2025/01/22 21:22:04">
          <p>チャットコメント。</p>
        </chat-button>
      </div>
    `;
  }
}
