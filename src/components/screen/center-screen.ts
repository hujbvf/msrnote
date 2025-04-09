import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { centerStyles } from "../style/center-style.ts";

import "../part/tab-changer.ts";

@customElement("center-screen")
export class CenterScreen extends LitElement {
  // 左画面の開閉状態
  @property({ type: Boolean, reflect: true })
  left_active = false;
  // 右画面の開閉状態
  @property({ type: Boolean, reflect: true })
  right_active = false;

  // 現在のタブ
  @state()
  private current_tab = "canvas";

  static styles = [globalStyles, centerStyles];

  // 左画面を開く
  private _leftOpen() {
    this.dispatchEvent(
      new CustomEvent("left_toggle", { bubbles: true, composed: true }),
    );
  }
  // 右画面を開く
  private _rightOpen() {
    this.dispatchEvent(
      new CustomEvent("right_toggle", { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <div class="header">
        <!--左画面を開く-->
        <button
          @click=${this._leftOpen}
          class=${this.left_active ? "icon hidden" : "icon"}
        >
          left_panel_open
        </button>
        <!--右画面を開く-->
        <button
          @click=${this._rightOpen}
          class=${this.right_active ? "icon hidden" : "icon"}
        >
          right_panel_open
        </button>
      </div>

      <div class="head">
        <span class="tab_changer selected">
          <!--タブを閉じる-->
          <button class="icon">disabled_by_default</button>
          <!--タブの名前-->
          <button class="name">ノート1</button>
        </span>
        <span class="tab_changer">
          <!--タブを閉じる-->
          <button class="icon">disabled_by_default</button>
          <!--タブの名前-->
          <button class="name">一覧</button>
        </span>
      </div>

      <div class="body">
        <!--タブの切り替え-->
        <tab-changer .current_tab=${this.current_tab}></tab-changer>
      </div>
    `;
  }
}
