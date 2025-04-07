import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { sideStyles } from "../style/side-style.ts";

@customElement("left-screen")
export class LeftScreen extends LitElement {
  // 左画面の開閉状態
  @property({ type: Boolean, reflect: true })
  left_active = false;

  static styles = [globalStyles, sideStyles];

  // 左画面を閉じる
  private _leftClose() {
    this.dispatchEvent(
      new CustomEvent("left_toggle", { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <div class="header">
        <!--左画面を閉じる-->
        <button @click=${this._leftClose} class="icon">left_panel_close</button>
        <!--現在のタブを新規タブで開く-->
        <button class="icon">select_window</button>
      </div>

      <div class="body"></div>

      <div class="footer">
        <!--一覧タブ-->
        <button class="selected" value="list">
          <div class="icon">list_alt</div>
          <div class="name">一覧</div>
        </button>
        <!--設定タブ-->
        <button value="set">
          <div class="icon">settings</div>
          <div class="name">設定</div>
        </button>
        <!--読み物タブ-->
        <button value="doc">
          <div class="icon">developer_guide</div>
          <div class="name">読み物</div>
        </button>
        <!--ストアタブ-->
        <button value="store">
          <div class="icon">storefront</div>
          <div class="name">ストア</div>
        </button>
      </div>
    `;
  }
}
