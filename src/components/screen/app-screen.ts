import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";
import { appStyles } from "../style/app-style.ts";

import "./left-screen.ts";
import "./right-screen.ts";
import "./center-screen.ts";

@customElement("app-screen")
export class AppScreen extends LitElement {
  // 左画面の開閉状態
  @property({ type: Boolean, reflect: true })
  left_active = false;
  // 右画面の開閉状態
  @property({ type: Boolean, reflect: true })
  right_active = false;

  static styles = [globalStyles, appStyles];

  constructor() {
    super();
    // 左画面の開閉状態を変更するイベントリスナーを追加
    this.addEventListener("left_toggle", this._leftToggle.bind(this));
    // 右画面の開閉状態を変更するイベントリスナーを追加
    this.addEventListener("right_toggle", this._rightToggle.bind(this));
    // 画面リサイズ時にサイド画面を閉じるイベントリスナーを追加
    window.addEventListener("resize", this._sideClose.bind(this));
  }

  // 画面がリサイズされたらサイド画面を閉じる
  private _sideClose() {
    if (this.left_active) this.left_active = false;
    if (this.right_active) this.right_active = false;
  }
  // 左画面の開閉状態を変更する
  private _leftToggle() {
    this.left_active = !this.left_active;
    // 画面幅が900px未満なら右画面を閉じる
    if (this.left_active && window.innerWidth < 900) this.right_active = false;
  }
  // 右画面の開閉状態を変更する
  private _rightToggle() {
    this.right_active = !this.right_active;
    // 画面幅が900px未満なら左画面を閉じる
    if (this.right_active && window.innerWidth < 900) this.left_active = false;
  }

  render() {
    return html`
      <left-screen .left_active=${this.left_active}></left-screen>
      <center-screen
        .left_active=${this.left_active}
        .right_active=${this.right_active}
      ></center-screen>
      <right-screen .right_active=${this.right_active}></right-screen>
    `;
  }
}
