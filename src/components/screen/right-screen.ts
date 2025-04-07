import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { sideStyles } from "../style/side-style.ts";

@customElement("right-screen")
export class RightScreen extends LitElement {
  // 右画面の開閉状態
  @property({ type: Boolean, reflect: true })
  right_active = false;

  static styles = [globalStyles, sideStyles];

  // 右画面を閉じる
  private _rightClose() {
    this.dispatchEvent(
      new CustomEvent("right_toggle", { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <div class="header">
        <!--現在のタブを新規タブで開く-->
        <button class="icon">select_window</button>
        <!--右画面を閉じる-->
        <button @click=${this._rightClose} class="icon">
          right_panel_close
        </button>
      </div>

      <div class="body"></div>

      <div class="footer">
        <!--レイヤータブ-->
        <button class="selected" value="layer">
          <div class="icon">layers</div>
          <div class="name">レイヤー</div>
        </button>
        <!--ページタブ-->
        <button value="page">
          <div class="icon">description</div>
          <div class="name">ページ</div>
        </button>
        <!--ツールタブ-->
        <button value="tool">
          <div class="icon">service_toolbox</div>
          <div class="name">ツール</div>
        </button>
        <!--フォーラムタブ-->
        <button value="forum">
          <div class="icon">forum</div>
          <div class="name">フォーラム</div>
        </button>
      </div>
    `;
  }
}
