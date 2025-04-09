import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { sideStyles } from "../style/side-style.ts";

import "../part/tab-changer.ts";

@customElement("left-screen")
export class LeftScreen extends LitElement {
  // 左画面の開閉状態
  @property({ type: Boolean, reflect: true })
  left_active = false;

  // 現在のタブ
  @state()
  private _current_tab = "list";

  static styles = [globalStyles, sideStyles];

  // 左画面を閉じる
  private _leftClose() {
    this.dispatchEvent(
      new CustomEvent("left_toggle", { bubbles: true, composed: true }),
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
        <!--左画面を閉じる-->
        <button @click=${this._leftClose} class="icon">left_panel_close</button>
        <!--現在のタブを新規タブで開く-->
        <button class="icon">select_window</button>
      </div>

      <div class="body">
        <!--タブの切り替え-->
        <tab-changer .current_tab=${this._current_tab}></tab-changer>
      </div>

      <div class="footer">
        <!--一覧タブ-->
        <button class="selected" value="list" @click=${this._changeTab}>
          <div class="icon">list_alt</div>
          <div class="name">一覧</div>
        </button>
        <!--設定タブ-->
        <button value="set" @click=${this._changeTab}>
          <div class="icon">settings</div>
          <div class="name">設定</div>
        </button>
        <!--読み物タブ-->
        <button value="doc" @click=${this._changeTab}>
          <div class="icon">developer_guide</div>
          <div class="name">読み物</div>
        </button>
        <!--ストアタブ-->
        <button value="store" @click=${this._changeTab}>
          <div class="icon">storefront</div>
          <div class="name">ストア</div>
        </button>
      </div>
    `;
  }
}
