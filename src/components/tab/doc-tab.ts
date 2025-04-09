import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/toc-input.ts";

@customElement("doc-tab")
export class DocTab extends LitElement {
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
        <span class="name">読み物</span>
      </div>

      <!--目次-->
      <div class="toc_area">
        <toc-input></toc-input>
      </div>

      <!--内容-->
      <div class="content_area">
        <button class="link">
          <div class="name">アプリの基本操作</div>
          <div class="icon">chevron_right</div>
        </button>
        <button class="link">
          <div class="name">ツールの基本操作</div>
          <div class="icon">chevron_right</div>
        </button>
      </div>
    `;
  }
}
