import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/toc-input.ts";

@customElement("tool-tab")
export class ToolTab extends LitElement {
  static styles = [
    globalStyles,
    tabStyles,
    css`
      .link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: auto;
        padding: 8px;
        margin: var(--smaller-padding) 0;
        border: 2px solid var(--middle-color);
        border-radius: 5px;
        background: var(--base-color);
      }
      .link:hover {
        background: var(--middle-color);
      }
    `,
  ];

  render() {
    return html`
      <!--タイトル-->
      <div class="title_area">
        <!--タブタイトル-->
        <span class="name">ツール</span>
      </div>

      <!--目次-->
      <div class="toc_area">
        <toc-input></toc-input>
      </div>

      <!--内容-->
      <div class="content_area">
        <h2>執筆</h2>
        <button class="link">
          <div class="name">テキスト</div>
          <div class="icon">chevron_right</div>
        </button>

        <h2>描画</h2>
        <button class="link">
          <div class="name">パス</div>
          <div class="icon">chevron_right</div>
        </button>
        <button class="link">
          <div class="name">ピクセル</div>
          <div class="icon">chevron_right</div>
        </button>

        <h2>公開</h2>
        <button class="link">
          <div class="name">Webサイト</div>
          <div class="icon">chevron_right</div>
        </button>

        <h2>その他</h2>
        <button class="link">
          <span class="name">背景</span>
          <span class="icon">chevron_right</span>
        </button>
        <button class="link">
          <span class="name">キャンバス</span>
          <span class="icon">chevron_right</span>
        </button>
      </div>
    `;
  }
}
