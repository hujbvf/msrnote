import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/toc-input.ts";

@customElement("set-tab")
export class SetTab extends LitElement {
  static styles = [
    globalStyles,
    tabStyles,
    css`
      button {
        width: 100%;
        height: auto;
        padding: var(--smaller-padding) var(--base-padding);
        border: solid 2px var(--middle-color);
        border-radius: 5px;
      }
    `,
  ];

  private async _logout() {
    await fetch("/api/logout", { method: "POST" });
    // 念のためフロント側でもリダイレクト
    window.location.href = "/login/";
  }

  render() {
    return html`
      <!--タイトル-->
      <div class="title_area">
        <!--タブタイトル-->
        <span class="name">設定</span>
      </div>

      <!--目次-->
      <div class="toc_area">
        <toc-input></toc-input>
      </div>

      <!--内容-->
      <div class="content_area">
        <h2 id="toc_account">アカウント</h2>
        <button @click=${this._logout}>ログアウト</button>
      </div>
    `;
  }
}
