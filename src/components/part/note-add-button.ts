import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

import { globalStyles } from "../style/global-style.ts";

@customElement("note-add-button")
export class NoteAddButton extends LitElement {
  static styles = [
    globalStyles,
    css`
      button {
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

  render() {
    return html`
      <button>
        <img src="/imgs/note-add.png" alt="ノートを新規追加" loading="lazy" />
        <span class="disc">
          <div class="name">新規ノート</div>
        </span>
      </button>
    `;
  }
}
