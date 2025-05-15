import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";

import { globalStyles } from "../style/global-style.ts";
import { tabStyles } from "../style/tab-style.ts";

import "../part/toc-input.ts";

import { tabContext, type TabData } from "../context/tab-context.ts";

@customElement("info-tab")
export class InfoTab extends LitElement {
  @consume({ context: tabContext, subscribe: true })
  tabData?: TabData;

  // ノートのサイズ
  private _noteSize: string = "0";

  firstUpdated() {
    const size = this.tabData?.noteDatas[this.tabData?.activeTab]?.size;
    if (size) this._noteSize = size.toString();
  }

  static styles = [
    globalStyles,
    tabStyles,
    css`
      input {
        width: 100%;
        height: 100%;
        padding: var(--smaller-padding) var(--base-padding);
        margin-bottom: var(--base-padding);
        border: solid 2px var(--middle-color);
        border-radius: 5px;
      }

      p {
        margin-bottom: var(--base-padding);
      }

      button {
        width: 100%;
        height: 100%;
        padding: var(--smaller-padding) var(--base-padding);
        margin-bottom: var(--base-padding);
        border: solid 2px var(--red-color);
        border-radius: 5px;
        color: var(--red-color);
      }
      button:hover {
        background: var(--middle-color);
      }
    `,
  ];

  // 目次の要素に移動
  private _moveToToc(event: CustomEvent) {
    const id = event.detail;

    // idの要素を取得
    let element: HTMLElement | null = null;
    if (id === "top") {
      element = this.shadowRoot?.querySelector(".content_area")
        ?.firstElementChild as HTMLElement;
    } else {
      element = this.shadowRoot?.getElementById(id) as HTMLElement;
    }

    if (element) {
      // スクロール
      element.scrollIntoView({
        behavior: "smooth", // スムーズにスクロール
        block: "start", // 上部に合わせる
        inline: "nearest", // 左右は無視
      });
    }
  }

  render() {
    return html`
      <!--タイトル-->
      <div class="title_area">
        <!--タブタイトル-->
        <span class="name">基本情報</span>
      </div>

      <!--目次-->
      <div class="toc_area">
        <toc-input
          @toc-select=${this._moveToToc}
          .items=${[
            { name: "ノートの名前", value: "note_name" },
            { name: "ノートの作成日", value: "note_date" },
            { name: "ノートの ID", value: "note_id" },
            { name: "ノートのパス", value: "note_path" },
            { name: "ノートのサイズ", value: "note_size" },
            { name: "ノートの削除", value: "note_delete" },
          ]}
        ></toc-input>
      </div>

      <!--内容-->
      <div class="content_area">
        <section id="note_name">
          <h2>ノートの名前</h2>
          <input
            type="text"
            placeholder="ノートの名前を入力"
            .value=${this.tabData?.noteDatas[this.tabData?.activeTab]?.name ||
            ""}
          />
        </section>
        <section id="note_date">
          <h2>ノートの作成日</h2>
          <p>${this.tabData?.noteDatas[this.tabData?.activeTab]?.date || ""}</p>
        </section>
        <section id="note_id">
          <h2>ノートの ID</h2>
          <p>${this.tabData?.noteDatas[this.tabData?.activeTab]?.id || ""}</p>
        </section>
        <section id="note_path">
          <h2>ノートのパス</h2>
          <p>${this.tabData?.noteDatas[this.tabData?.activeTab]?.path || ""}</p>
        </section>
        <section id="note_size">
          <h2>ノートのサイズ</h2>
          <p>${this._noteSize} B</p>
        </section>
        <section id="note_delete">
          <h2>ノートの削除</h2>
          <button>ノートを削除する</button>
        </section>
      </div>
    `;
  }
}
