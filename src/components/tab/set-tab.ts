import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/toc-input.ts";

@customElement("set-tab")
export class SetTab extends LitElement {
  static styles = [globalStyles, tabStyles];

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
        <h2 id="toc_style">スタイル</h2>
      </div>
    `;
  }
}
