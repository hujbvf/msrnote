import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

@customElement("note-group-button")
export class NoteGroupButton extends LitElement {
  // ノートグループの名前
  @property({ type: String })
  name = "";
  // ノートの数
  @property({ type: String })
  num = "";
  // ノートグループの選択状態
  @property({ type: Boolean })
  selected = false;

  static styles = [
    globalStyles,
    css`
      .button {
        display: flex;
        align-items: center;
        width: 100%;
        height: auto;
        padding: 5px 0;
        position: relative;
        border-radius: 5px;
      }
      .button.selected {
        background: var(--middle-color);
      }

      img {
        width: 55px;
        height: auto;
      }

      .disc {
        width: 100%;
        height: auto;
        text-align: left;
      }

      .num {
        color: var(--shadow-color);
        font-size: var(--small-font);
      }
    `,
  ];

  // ノートの名前を変更
  private _changeName() {
    const name = this.shadowRoot?.getElementById("name") as HTMLDivElement;
    name.contentEditable = "true";

    let isComposing = false; // IME入力中かどうかを判定するフラグ

    // IME入力開始
    name.addEventListener("compositionstart", () => {
      isComposing = true;
    });

    // IME入力確定
    name.addEventListener("compositionend", () => {
      isComposing = false;
    });

    // keydownイベント（Enterキー）
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isComposing) {
        this._changeNameEnd();

        name.blur();
      }
    };

    // clickイベント
    const handleMousedown = (event: Event) => {
      const path = event.composedPath(); // イベントの伝播経路を取得
      if (!path.includes(name)) {
        this._changeNameEnd();

        name.blur();
      }
    };

    name.addEventListener("focus", () => {
      document.body.addEventListener("keydown", handleKeydown);
      document.body.addEventListener("mousedown", handleMousedown);
    });

    name.addEventListener("blur", () => {
      document.body.removeEventListener("keydown", handleKeydown);
      document.body.removeEventListener("mousedown", handleMousedown);
    });

    name.focus();
  }

  // ノートの名前変更完了
  private _changeNameEnd() {
    const name = this.shadowRoot?.getElementById("name") as HTMLDivElement;
    name.contentEditable = "false";

    if (name.innerText.trim().length > 0) {
      this.name = name.innerText.trim();

      this.dispatchEvent(
        new CustomEvent("rename-note-group", { bubbles: true, composed: true }),
      );
    } else {
      name.innerText = this.name;
    }
  }

  // ノートを開く
  private _openNote(event: Event) {
    const target = event.target as HTMLElement;

    if (target.closest("#name")) return;

    this.dispatchEvent(
      new CustomEvent("open-note", { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <div
        class="${this.selected ? "selected button" : "button"}"
        @click=${this._openNote}
      >
        <img src="/imgs/note-group.png" alt="ノートグループ" loading="lazy" />
        <span class="disc">
          <div class="name" id="name" @dblclick=${this._changeName}>
            ${this.name}
          </div>
          <div class="num">${this.num}項目</div>
        </span>
      </div>
    `;
  }
}
