import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { provide } from "@lit/context";

import { globalStyles } from "../style/global-style.ts";
import { appStyles } from "../style/app-style.ts";

import "./left-screen.ts";
import "./right-screen.ts";
import "./center-screen.ts";

import { planContext, type PlanData } from "../context/plan-context.ts";
import { tabContext, type TabData } from "../context/tab-context.ts";

@customElement("app-screen")
export class AppScreen extends LitElement {
  // 左画面の開閉状態
  @property({ type: Boolean, reflect: true })
  left_active = false;
  // 右画面の開閉状態
  @property({ type: Boolean, reflect: true })
  right_active = false;
  // プランの状態
  @property({ type: String })
  plan = "free";

  // プランの状態
  @provide({ context: planContext })
  planData: PlanData = "free";
  // タブの状態
  @provide({ context: tabContext })
  tabData: TabData = {
    noteDatas: [],
    activeTab: 0,
    addNoteData: (noteData) => {
      this.tabData.noteDatas = [...this.tabData.noteDatas, noteData];
      this.requestUpdate();
    },
    removeNoteData: (sort) => {
      this.tabData.noteDatas = this.tabData.noteDatas.filter(
        (_, index) => index !== sort,
      );
      this.requestUpdate();
    },
    changeActiveTab: (sort) => {
      this.tabData.activeTab = sort;
      this.requestUpdate();
    },
  };

  static styles = [globalStyles, appStyles];

  constructor() {
    super();
    // 左画面の開閉状態を変更するイベントリスナーを追加
    this.addEventListener("left_toggle", this._leftToggle.bind(this));
    // 右画面の開閉状態を変更するイベントリスナーを追加
    this.addEventListener("right_toggle", this._rightToggle.bind(this));
    // 画面リサイズ時にサイド画面を閉じるイベントリスナーを追加
    window.addEventListener("resize", this._sideClose.bind(this));
    // プランの状態を変更するイベントリスナーを追加
    this.addEventListener("plan_change", this._planChange as EventListener);
    // タブの状態を変更するイベントリスナーを追加
    this.addEventListener("add-tab", this._addTab as EventListener);
    this.addEventListener("remove-tab", this._removeTab as EventListener);
    this.addEventListener(
      "change-active-tab",
      this._changeActiveTab as EventListener,
    );
  }

  firstUpdated() {
    // プランの状態を提供する
    this.planData = this.plan;
  }

  // プランの状態を変更する
  private _planChange(e: CustomEvent) {
    this.plan = e.detail.plan;
    this.planData = this.plan;
  }

  // タブの状態を変更する
  private _addTab(e: CustomEvent) {
    const noteData = e.detail;
    this.tabData.addNoteData(noteData);
  }
  private _removeTab(e: CustomEvent) {
    const sort = e.detail;
    this.tabData.removeNoteData(sort);
  }
  private _changeActiveTab(e: CustomEvent) {
    const sort = e.detail;
    this.tabData.changeActiveTab(sort);
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
