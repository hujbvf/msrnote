import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

@customElement("search-input")
export class SearchInput extends LitElement {
  @property({ type: String })
  placeholder = "";

  static styles = [
    globalStyles,
    css`
      :host {
        padding: 0 var(--smaller-padding);
      }

      .search {
        display: flex;
        align-items: center;
        width: 100%;
        height: auto;
        padding: 0;
        background: var(--middle-color);
        border-radius: 5px;
      }

      input {
        width: 100%;
        height: auto;
        margin: 0 5px;
      }

      button {
        padding-left: 5px;
        margin: 0 5px;
        border-left: solid 2px var(--base-color);
      }
    `,
  ];

  private _focusQueryInput() {
    const input = this.shadowRoot?.getElementById(
      "query_input",
    ) as HTMLInputElement;

    let isComposing = false; // IME入力中かどうかを判定するフラグ

    // IME入力開始
    input.addEventListener("compositionstart", () => {
      isComposing = true;
    });

    // IME入力確定
    input.addEventListener("compositionend", () => {
      isComposing = false;
    });

    // keydownイベント（Enterキー）
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isComposing) {
        this._blurQueryInput();

        input.blur();
      }
    };

    // clickイベント
    const handleMousedown = (event: Event) => {
      const path = event.composedPath(); // イベントの伝播経路を取得
      if (!path.includes(input)) {
        this._blurQueryInput();

        input.blur();
      }
    };

    document.body.addEventListener("keydown", handleKeydown);
    document.body.addEventListener("mousedown", handleMousedown);

    input.addEventListener("blur", () => {
      document.body.removeEventListener("keydown", handleKeydown);
      document.body.removeEventListener("mousedown", handleMousedown);
    });
  }

  // ノートの名前変更完了
  private _blurQueryInput() {
    const input = this.shadowRoot?.getElementById(
      "query_input",
    ) as HTMLInputElement;

    if (input.value.trim().length > 0) {
      this.dispatchEvent(
        new CustomEvent("query-submit", {
          detail: input.value,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  render() {
    return html`
      <div class="search">
        <input
          id="query_input"
          type="text"
          placeholder=${this.placeholder}
          @focus=${this._focusQueryInput}
        />
        <button @click=${this._blurQueryInput}>
          <span class="icon">search</span>
        </button>
      </div>
    `;
  }
}
