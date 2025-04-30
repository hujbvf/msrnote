import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

@customElement("note-add-button")
export class NoteAddButton extends LitElement {
  static styles = [
    globalStyles,
    css`
      label {
        display: flex;
        align-items: center;
        width: 100%;
        height: auto;
        padding: 5px 0;
        position: relative;
        border-radius: 5px;
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
    `,
  ];

  // ノートの新規作成
  private _addNote() {
    const select = this.shadowRoot?.getElementById(
      "add-note",
    ) as HTMLSelectElement;
    const value = select.value;

    if (value === "note") {
      // ノートを新規作成
      this.dispatchEvent(
        new CustomEvent("add-note", { bubbles: true, composed: true }),
      );
    } else if (value === "group") {
      // グループを新規作成
      this.dispatchEvent(
        new CustomEvent("add-group", { bubbles: true, composed: true }),
      );
    }

    // 選択肢をリセット
    select.value = "cancel";
  }

  render() {
    return html`
      <select id="add-note" class="hidden" @change=${this._addNote}>
        <option value="cancel">キャンセル</option>
        <option value="note">ノートを追加</option>
        <option value="group">グループを追加</option>
      </select>
      <label for="add-note">
        <img src="/imgs/note-add.png" alt="ノートを新規追加" loading="lazy" />
        <span class="disc">
          <div class="name">新規ノート</div>
        </span>
      </label>
    `;
  }
}
