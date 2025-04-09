import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { sideStyles } from "../style/side-style.ts";

import "../part/tab-changer.ts";

@customElement("right-screen")
export class RightScreen extends LitElement {
  // 右画面の開閉状態
  @property({ type: Boolean, reflect: true })
  right_active = false;

  // 現在のタブ
  @state()
  private _current_tab = "layer";

  static styles = [globalStyles, sideStyles];

  // 右画面を閉じる
  private _rightClose() {
    this.dispatchEvent(
      new CustomEvent("right_toggle", { bubbles: true, composed: true }),
    );
  }

  // タブの切り替え
  private _changeTab(e: Event) {
    const target = (e.target as HTMLElement).closest("button");
    if (!target) return;

    const value = target.value;
    if (!value) return;

    const selected = this.shadowRoot?.querySelector(".selected");
    if (selected) selected.classList.remove("selected");

    target.classList.add("selected");

    this._current_tab = value;
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

      <div class="body">
        <!--タブの切り替え-->
        <tab-changer .current_tab=${this._current_tab}></tab-changer>
      </div>

      <div class="footer">
        <!--レイヤータブ-->
        <button class="selected" value="layer" @click=${this._changeTab}>
          <div class="icon">layers</div>
          <div class="name">レイヤー</div>
        </button>
        <!--ページタブ-->
        <button value="page" @click=${this._changeTab}>
          <div class="icon">description</div>
          <div class="name">ページ</div>
        </button>
        <!--ツールタブ-->
        <button value="tool" @click=${this._changeTab}>
          <div class="icon">service_toolbox</div>
          <div class="name">ツール</div>
        </button>
        <!--フォーラムタブ-->
        <button value="forum" @click=${this._changeTab}>
          <div class="icon">forum</div>
          <div class="name">フォーラム</div>
        </button>
      </div>
    `;
  }
}
